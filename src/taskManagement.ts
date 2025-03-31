/**
 * Task Management Functions for Chunkr API
 * Handles operations like deleting, canceling, and updating tasks
 */
import { AxiosResponse } from "axios";
import { chunkrApiClient } from "./apiClient";
import {
  ChunkrTaskResponse,
  ChunkrUpdateTaskInput,
  ChunkrHealthResponse,
} from "./types";

/**
 * Deletes a task from Chunkr
 *
 * @param taskId The ID of the task to delete
 * @returns Promise resolving to void when successful
 * @throws Error if the deletion fails
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await chunkrApiClient.delete(`/task/${taskId}`);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while deleting task";

    throw new Error(`Failed to delete Chunkr task: ${errorMessage}`);
  }
};

/**
 * Cancels a running task in Chunkr
 * Only tasks in 'Starting' or 'Processing' state can be cancelled
 *
 * @param taskId The ID of the task to cancel
 * @returns Promise resolving to the task response with 'Cancelled' status
 * @throws Error if the cancellation fails
 */
export const cancelTask = async (
  taskId: string
): Promise<ChunkrTaskResponse> => {
  try {
    const response: AxiosResponse<ChunkrTaskResponse> =
      await chunkrApiClient.get(`/task/${taskId}/cancel`);

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while canceling task";

    throw new Error(`Failed to cancel Chunkr task: ${errorMessage}`);
  }
};

/**
 * Updates task configuration in Chunkr
 * This allows updating segment processing configuration and expiration
 *
 * @param taskId The ID of the task to update
 * @param updateData Configuration updates to apply
 * @returns Promise resolving to the updated task response
 * @throws Error if the update fails
 */
export const updateTask = async (
  taskId: string,
  updateData: ChunkrUpdateTaskInput
): Promise<ChunkrTaskResponse> => {
  try {
    const response: AxiosResponse<ChunkrTaskResponse> =
      await chunkrApiClient.patch(`/task/${taskId}`, updateData);

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while updating task";

    throw new Error(`Failed to update Chunkr task: ${errorMessage}`);
  }
};

/**
 * Checks the health of the Chunkr API
 *
 * @returns Promise resolving to a health response with status
 * @throws Error if the health check fails
 */
export const checkHealth = async (): Promise<ChunkrHealthResponse> => {
  try {
    const response: AxiosResponse<ChunkrHealthResponse> =
      await chunkrApiClient.get("/health");
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred while checking health";

    throw new Error(`Chunkr health check failed: ${errorMessage}`);
  }
};
