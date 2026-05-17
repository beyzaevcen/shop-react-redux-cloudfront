import axios from "axios";
import API_PATHS from "~/constants/apiPaths";

type ImportUrlResponse = {
  signedUrl: string;
};

export async function getImportUrl(fileName: string) {
  const token = localStorage.getItem("authorization_token");
  try {
    const response = await axios.get<ImportUrlResponse>(
      `${API_PATHS.import}/import`,
      {
        params: {
          name: fileName,
        },
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        alert(
          "Please provide authorization token in localStorage (key: authorization_token)"
        );
      } else if (error.response?.status === 403) {
        alert("You are not authorized to perform this action");
      }
    }
    throw new Error("Failed to request import URL.");
  }
}
