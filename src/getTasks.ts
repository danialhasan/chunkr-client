/**
 * Functions for listing and filtering Chunkr tasks
 */
import { AxiosResponse } from "axios";
import { chunkrApiClient } from "./apiClient";
import { ChunkrTaskResponse, ChunkrListTasksQuery } from "./types";

/**
 * Lists Chunkr tasks with filtering and pagination
 *
 * @param options Filtering and pagination options
 * @returns Promise resolving to an array of task responses
 */
export const getTasks = async (
  options: ChunkrListTasksQuery = {}
): Promise<ChunkrTaskResponse[]> => {
  try {
    // Construct query parameters
    const params = new URLSearchParams();

    if (options.page !== undefined) {
      params.append("page", options.page.toString());
    }

    if (options.limit !== undefined) {
      params.append("limit", options.limit.toString());
    }

    if (options.include_chunks !== undefined) {
      params.append("include_chunks", options.include_chunks.toString());
    }

    if (options.base64_urls !== undefined) {
      params.append("base64_urls", options.base64_urls.toString());
    }

    if (options.start) {
      params.append("start", options.start);
    }

    if (options.end) {
      params.append("end", options.end);
    }

    // Build URL with query parameters
    const queryString = params.toString();
    const url = `/tasks${queryString ? `?${queryString}` : ""}`;

    const response: AxiosResponse<ChunkrTaskResponse[]> =
      await chunkrApiClient.get(url);
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while listing tasks";

    throw new Error(`Failed to list Chunkr tasks: ${errorMessage}`);
  }
};

/**
 * Get recent tasks within a specific date range
 *
 * @param days Number of days to look back
 * @param options Additional filtering options
 * @returns Promise resolving to array of recent tasks
 */
export const getRecentTasks = async (
  days: number = 7,
  options: Omit<ChunkrListTasksQuery, "start" | "end"> = {}
): Promise<ChunkrTaskResponse[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return getTasks({
    ...options,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  });
};

/**
 * Get tasks filtered by success status
 *
 * @param succeeded If true, returns succeeded tasks; if false, returns failed tasks
 * @param options Additional filtering options
 * @returns Promise resolving to filtered tasks
 */
export const getTasksByStatus = async (
  status: "Succeeded" | "Failed" | "Processing" | "Starting",
  options: ChunkrListTasksQuery = {}
): Promise<ChunkrTaskResponse[]> => {
  const tasks = await getTasks(options);
  return tasks.filter((task) => task.status === status);
};
