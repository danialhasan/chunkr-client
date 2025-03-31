/**
 * Chunkr API Integration - Main Entry Point
 *
 * Exports all Chunkr functionality and provides the main document processing flow
 */
import {
  createTask,
  createTaskFromUrl,
  createTaskFromBase64,
} from "./createTask";
import { getTaskById, pollTask } from "./pollTask";
import { getTasks, getRecentTasks, getTasksByStatus } from "./getTasks";
import {
  deleteTask,
  cancelTask,
  updateTask,
  checkHealth,
} from "./taskManagement";
import { chunkrApiClient, createChunkrApiClient } from "./apiClient";
import {
  ChunkrConfiguration,
  ChunkrCreateTaskInput,
  ChunkrUpdateTaskInput,
  ChunkrTaskResponse,
  ChunkrResult,
  Chunk,
  ChunkrMetadata,
  ChunkrHealthResponse,
} from "./types";

// Re-export all functionality
export {
  // API client
  chunkrApiClient,
  createChunkrApiClient,

  // Task creation
  createTask,
  createTaskFromUrl,
  createTaskFromBase64,

  // Task polling
  getTaskById,
  pollTask,

  // Task listing
  getTasks,
  getRecentTasks,
  getTasksByStatus,

  // Task management
  deleteTask,
  cancelTask,
  updateTask,

  // Health check
  checkHealth,

  // Types
  ChunkrConfiguration,
  ChunkrCreateTaskInput,
  ChunkrUpdateTaskInput,
  ChunkrTaskResponse,
  ChunkrResult,
  Chunk,
  ChunkrMetadata,
  ChunkrHealthResponse,
};

/**
 * Main document processing flow
 *
 * This function encapsulates the entire process:
 * 1. Creates a task with the document
 * 2. Polls until processing completes
 * 3. Returns the processed chunks and metadata
 *
 * @param fileUrl URL to the document to process
 * @param fileName Original file name
 * @param options Additional configuration options
 * @returns Promise resolving to chunks and metadata
 */
export const runChunkrDocumentFlow = async (
  fileUrl: string,
  fileName: string,
  options: Partial<ChunkrCreateTaskInput> = {}
): Promise<ChunkrResult> => {
  try {
    // Step 1: Create the task
    const task = await createTaskFromUrl(fileUrl, fileName, options);

    // Step 2: Poll until task completion
    const completedTask = await pollTask(task.task_id, {
      include_chunks: true,
    });

    // Step 3: Validate and extract results
    if (completedTask.status !== "Succeeded" || !completedTask.output) {
      throw new Error(`Task ${task.task_id} failed or has no output`);
    }

    // Return the structured result
    return {
      chunks: completedTask.output.chunks,
      metadata: completedTask.output.metadata,
      taskId: completedTask.task_id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error in document processing flow";

    throw new Error(`Chunkr document flow failed: ${errorMessage}`);
  }
};

/**
 * Process a document from base64-encoded content
 *
 * Similar to runChunkrDocumentFlow but uses base64 content instead of URL
 *
 * @param base64Content Base64-encoded document content
 * @param fileName Original file name
 * @param options Additional configuration options
 * @returns Promise resolving to chunks and metadata
 */
export const runChunkrDocumentFlowFromBase64 = async (
  base64Content: string,
  fileName: string,
  options: Partial<ChunkrCreateTaskInput> = {}
): Promise<ChunkrResult> => {
  try {
    // Step 1: Create the task with base64 content
    const task = await createTaskFromBase64(base64Content, fileName, options);

    // Step 2: Poll until task completion
    const completedTask = await pollTask(task.task_id, {
      include_chunks: true,
    });

    // Step 3: Validate and extract results
    if (completedTask.status !== "Succeeded" || !completedTask.output) {
      throw new Error(`Task ${task.task_id} failed or has no output`);
    }

    // Return the structured result
    return {
      chunks: completedTask.output.chunks,
      metadata: completedTask.output.metadata,
      taskId: completedTask.task_id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error in document processing flow (base64)";

    throw new Error(`Chunkr document flow failed: ${errorMessage}`);
  }
};
