import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getImportUrl } from "~/queries/import";
import { uploadCsvFile } from "~/utils/upload";

type CSVFileImportProps = {
  title: string;
};

const SUCCESS_MESSAGE =
  "File uploaded successfully. Import processing has started.";
const CSV_FILE_EXTENSION = ".csv";

export default function CSVFileImport({ title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [isUploading, setIsUploading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const isCsvFile = React.useCallback(
    (selectedFile: File) =>
      selectedFile.name.toLowerCase().endsWith(CSV_FILE_EXTENSION),
    []
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!files || files.length === 0) {
      setFile(undefined);
      setErrorMessage("Please select a CSV file to upload.");
      return;
    }

    const selectedFile = files[0];

    if (!isCsvFile(selectedFile)) {
      setFile(undefined);
      setErrorMessage("Only .csv files are supported.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(undefined);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const uploadFile = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) {
      setErrorMessage("Please select a CSV file to upload.");
      return;
    }

    if (!isCsvFile(file)) {
      setErrorMessage("Only .csv files are supported.");
      return;
    }

    setIsUploading(true);

    try {
      const { signedUrl } = await getImportUrl(file.name);
      await uploadCsvFile(signedUrl, file);
      setSuccessMessage(SUCCESS_MESSAGE);
      setFile(undefined);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={1.5} alignItems="flex-start">
        <Button variant="outlined" component="label" disabled={isUploading}>
          Select CSV file
          <input
            hidden
            type="file"
            accept=".csv,text/csv"
            onChange={onFileChange}
          />
        </Button>
        <Typography variant="body2" color="text.secondary">
          {file ? `Selected file: ${file.name}` : "No file selected"}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={uploadFile}
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <>
                <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Upload file"
            )}
          </Button>
          <Button
            variant="text"
            onClick={removeFile}
            disabled={isUploading || !file}
          >
            Clear
          </Button>
        </Stack>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
        {successMessage ? (
          <Alert severity="success">{successMessage}</Alert>
        ) : null}
      </Stack>
    </Box>
  );
}
