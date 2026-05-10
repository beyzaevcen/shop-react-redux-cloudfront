import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import CSVFileImport from "~/components/pages/admin/PageProductImport/components/CSVFileImport";
import { getImportUrl } from "~/queries/import";
import { renderWithProviders } from "~/testUtils";
import { uploadCsvFile } from "~/utils/upload";

vi.mock("~/queries/import", () => ({
  getImportUrl: vi.fn(),
}));

vi.mock("~/utils/upload", () => ({
  uploadCsvFile: vi.fn(),
}));

describe("CSVFileImport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows validation for non-csv files", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderWithProviders(<CSVFileImport title="Import Products CSV" />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const invalidFile = new File(["name,price"], "products.txt", {
      type: "text/plain",
    });

    await user.upload(input, invalidFile);

    expect(
      screen.getByText("Only .csv files are supported.")
    ).toBeInTheDocument();
    expect(screen.getByText("No file selected")).toBeInTheDocument();
  });

  test("uploads a csv file successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(getImportUrl).mockResolvedValue({
      signedUrl: "https://signed-url.example.com",
    });
    vi.mocked(uploadCsvFile).mockResolvedValue(undefined);

    renderWithProviders(<CSVFileImport title="Import Products CSV" />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const validFile = new File(["title,description,price\nBook,Desc,10"], "products.csv", {
      type: "text/csv",
    });

    await user.upload(input, validFile);
    await user.click(screen.getByRole("button", { name: "Upload file" }));

    await waitFor(() => {
      expect(getImportUrl).toHaveBeenCalledWith("products.csv");
      expect(uploadCsvFile).toHaveBeenCalledWith(
        "https://signed-url.example.com",
        validFile
      );
    });

    expect(
      screen.getByText(
        "File uploaded successfully. Import processing has started."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("No file selected")).toBeInTheDocument();
  });

  test("shows an error when requesting signed url fails", async () => {
    const user = userEvent.setup();
    vi.mocked(getImportUrl).mockRejectedValue(
      new Error("Failed to request import URL.")
    );

    renderWithProviders(<CSVFileImport title="Import Products CSV" />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const validFile = new File(["title,description,price"], "products.csv", {
      type: "text/csv",
    });

    await user.upload(input, validFile);
    await user.click(screen.getByRole("button", { name: "Upload file" }));

    expect(
      await screen.findByText("Failed to request import URL.")
    ).toBeInTheDocument();
    expect(uploadCsvFile).not.toHaveBeenCalled();
  });

  test("shows an error when upload fails", async () => {
    const user = userEvent.setup();
    vi.mocked(getImportUrl).mockResolvedValue({
      signedUrl: "https://signed-url.example.com",
    });
    vi.mocked(uploadCsvFile).mockRejectedValue(
      new Error("Failed to upload file to storage.")
    );

    renderWithProviders(<CSVFileImport title="Import Products CSV" />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const validFile = new File(["title,description,price"], "products.csv", {
      type: "text/csv",
    });

    await user.upload(input, validFile);
    await user.click(screen.getByRole("button", { name: "Upload file" }));

    expect(
      await screen.findByText("Failed to upload file to storage.")
    ).toBeInTheDocument();
  });
});