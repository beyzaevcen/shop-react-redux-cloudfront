import axios from "axios";
import API_PATHS from "~/constants/apiPaths";

type ImportUrlResponse = {
  signedUrl: string;
};

export async function getImportUrl(fileName: string) {
  try {
    const response = await axios.get<ImportUrlResponse>(
      `${API_PATHS.import}/import`,
      {
        params: {
          name: fileName,
        },
      }
    );

    return response.data;
  } catch {
    throw new Error("Failed to request import URL.");
  }
}
