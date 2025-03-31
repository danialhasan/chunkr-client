/**
 * Functionality for creating a document processing task in Chunkr
 */
import { AxiosResponse } from "axios";
import { chunkrApiClient } from "./apiClient";
import { ChunkrCreateTaskInput, ChunkrTaskResponse } from "./types";

/**
 * Creates a new document processing task in Chunkr
 *
 * @param input Configuration for the document processing task
 * @returns Promise resolving to the task_id and initial status
 */
export const createTask = async (
  input: ChunkrCreateTaskInput
): Promise<ChunkrTaskResponse> => {
  try {
    const response: AxiosResponse<ChunkrTaskResponse> =
      await chunkrApiClient.post("/task/parse", input);

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while creating Chunkr task";

    throw new Error(`Chunkr task creation failed: ${errorMessage}`);
  }
};

/**
 * Creates a task from a file URL
 *
 * @param fileUrl Public URL to the file
 * @param fileName Original file name
 * @param options Additional Chunkr configuration options
 * @returns Promise resolving to the task response
 */
export const createTaskFromUrl = async (
  fileUrl: string,
  fileName: string,
  options: Partial<ChunkrCreateTaskInput> = {}
): Promise<ChunkrTaskResponse> => {
  const defaultOptions = {
    ocr_strategy: "Auto" as "Auto",
    pipeline: "Azure" as "Azure",
    chunk_processing: {
      ignore_headers_and_footers: true,
      target_length: 512,
    },
  };

  return createTask({
    file: fileUrl,
    file_name: fileName,
    ...defaultOptions,
    ...options,
  });
};

/**
 * Creates a task from a base64-encoded file
 *
 * @param base64String Base64 encoded file content
 * @param fileName Original file name
 * @param options Additional Chunkr configuration options
 * @returns Promise resolving to the task response
 */
export const createTaskFromBase64 = async (
  base64String: string,
  fileName: string,
  options: Partial<ChunkrCreateTaskInput> = {}
): Promise<ChunkrTaskResponse> => {
  const defaultOptions = {
    ocr_strategy: "Auto" as "Auto",
    pipeline: "Azure" as "Azure",
    chunk_processing: {
      ignore_headers_and_footers: true,
      target_length: 512,
    },
  };

  return createTask({
    file: base64String,
    file_name: fileName,
    ...defaultOptions,
    ...options,
  });
};
