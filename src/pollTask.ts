/**
 * Functions for polling Chunkr tasks until completion
 */
import { AxiosResponse } from "axios";
import { chunkrApiClient } from "./apiClient";
import { ChunkrTaskResponse, ChunkrGetTaskQuery } from "./types";

/**
 * Gets the current status of a task
 *
 * @param taskId The ID of the task to retrieve
 * @param options Optional parameters for the query (include_chunks, base64_urls)
 * @returns Promise resolving to the task response
 */
export const getTaskById = async (
  taskId: string,
  options: ChunkrGetTaskQuery = {}
): Promise<ChunkrTaskResponse> => {
  try {
    // Construct query parameters
    const params = new URLSearchParams();

    if (options.include_chunks !== undefined) {
      params.append("include_chunks", options.include_chunks.toString());
    }

    if (options.base64_urls !== undefined) {
      params.append("base64_urls", options.base64_urls.toString());
    }

    // Build URL with query parameters
    const queryString = params.toString();
    const url = `/task/${taskId}${queryString ? `?${queryString}` : ""}`;

    const response: AxiosResponse<ChunkrTaskResponse> =
      await chunkrApiClient.get(url);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while getting task status";

    throw new Error(`Failed to get Chunkr task status: ${errorMessage}`);
  }
};

/**
 * Default delay between consecutive poll attempts (in milliseconds)
 */
const DEFAULT_POLL_INTERVAL = 1000;

/**
 * Default timeout for polling (in milliseconds)
 * 15 minutes should be sufficient for most documents
 */
const DEFAULT_POLL_TIMEOUT = 15 * 60 * 1000;

/**
 * Configuration for the poll function
 */
interface PollOptions extends ChunkrGetTaskQuery {
  pollInterval?: number;
  timeout?: number;
  onProgress?: (status: string, taskId: string) => void;
}

/**
 * Polls a Chunkr task until it completes (succeeds or fails)
 *
 * @param taskId The ID of the task to poll
 * @param options Configuration for polling behavior
 * @returns Promise resolving to the completed task
 * @throws Error if polling times out or the task fails
 */
export const pollTask = async (
  taskId: string,
  options: PollOptions = {}
): Promise<ChunkrTaskResponse> => {
  const {
    pollInterval = DEFAULT_POLL_INTERVAL,
    timeout = DEFAULT_POLL_TIMEOUT,
    onProgress,
    ...queryOptions
  } = options;

  const startTime = Date.now();

  // First check - always include chunks
  let includeChunks = queryOptions.include_chunks;

  // Loop until success, failure, or timeout
  while (true) {
    // Check if we've exceeded the timeout
    if (Date.now() - startTime > timeout) {
      throw new Error(
        `Polling timed out after ${timeout}ms for task ${taskId}`
      );
    }

    // Get current task status
    const task = await getTaskById(taskId, {
      ...queryOptions,
      // Only request chunks on the final response to reduce bandwidth
      include_chunks: includeChunks,
    });

    // Notify progress if callback provided
    if (onProgress) {
      onProgress(task.status, taskId);
    }

    // Check if task is complete
    if (task.status === "Succeeded") {
      // If we didn't request chunks yet and the task succeeded, get them now
      if (!includeChunks) {
        includeChunks = true;
        continue;
      }
      return task;
    } else if (task.status === "Failed") {
      throw new Error(`Chunkr task ${taskId} failed`);
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }
};
