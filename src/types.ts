/**
 * Types for Chunkr API Integration
 * Based on official API documentation at https://docs.chunkr.ai
 */

/**
 * Configuration options for document processing
 */
export interface ChunkrConfiguration {
  file_name: string;
  expires_in?: number;
  ocr_strategy?: "Auto" | "All";
  high_resolution?: boolean;
  pipeline?: "Azure" | "Chunkr";
  segmentation_strategy?: "LayoutAnalysis";
  chunk_processing?: {
    ignore_headers_and_footers?: boolean;
    target_length?: number;
  };
  segment_processing?: {
    Text?: {
      html?: "LLM";
      markdown?: "LLM";
    };
  };
}

/**
 * Input for creating a new task in Chunkr
 */
export interface ChunkrCreateTaskInput {
  file: string; // URL or base64 string (no multipart upload)
  file_name: string;
  expires_in?: number;
  ocr_strategy?: "Auto" | "All";
  high_resolution?: boolean;
  pipeline?: "Azure" | "Chunkr";
  segmentation_strategy?: "LayoutAnalysis";
  chunk_processing?: {
    ignore_headers_and_footers?: boolean;
    target_length?: number;
  };
  segment_processing?: {
    Text?: {
      html?: "LLM";
      markdown?: "LLM";
    };
  };
}

/**
 * Input for updating a task in Chunkr
 */
export interface ChunkrUpdateTaskInput {
  expires_in?: number;
  segment_processing?: {
    Text?: {
      html?: "LLM" | "Auto";
      markdown?: "LLM" | "Auto";
      llm?: string;
      crop_image?: "All" | "Auto";
      embed_sources?: Array<"HTML" | "Markdown" | "LLM" | "Content">;
    };
    Table?: {
      html?: "LLM" | "Auto";
      markdown?: "LLM" | "Auto";
      llm?: string;
      crop_image?: "All" | "Auto";
      embed_sources?: Array<"HTML" | "Markdown" | "LLM" | "Content">;
    };
    Formula?: {
      html?: "LLM" | "Auto";
      markdown?: "LLM" | "Auto";
      llm?: string;
      crop_image?: "All" | "Auto";
      embed_sources?: Array<"HTML" | "Markdown" | "LLM" | "Content">;
    };
    Picture?: {
      html?: "LLM" | "Auto";
      markdown?: "LLM" | "Auto";
      llm?: string;
      crop_image?: "All" | "Auto";
      embed_sources?: Array<"HTML" | "Markdown" | "LLM" | "Content">;
    };
  };
}

/**
 * A chunk of text extracted from the document
 */
export interface Chunk {
  id: string;
  text: string;
  page: number;
  bbox?: [number, number, number, number];
  source: {
    file_name: string;
    page: number;
  };
  chunk_index: number;
}

/**
 * Metadata about the processed document
 */
export interface ChunkrMetadata {
  file_name: string;
  num_pages: number;
  language: string;
  mime_type: string;
}

/**
 * Response for a task (creation, status check, etc.)
 */
export interface ChunkrTaskResponse {
  task_id: string;
  status: "Starting" | "Processing" | "Succeeded" | "Failed" | "Cancelled";
  created_at: string;
  expires_at: string;
  configuration: ChunkrConfiguration;
  output?: {
    chunks: Chunk[];
    metadata: ChunkrMetadata;
  } | null;
  started_at?: string;
  finished_at?: string;
  message?: string;
  task_url?: string;
}

/**
 * Query parameters for listing tasks
 */
export interface ChunkrListTasksQuery {
  page?: number;
  limit?: number;
  include_chunks?: boolean;
  base64_urls?: boolean;
  start?: string; // ISO8601 date
  end?: string; // ISO8601 date
}

/**
 * Query parameters for getting a task by ID
 */
export interface ChunkrGetTaskQuery {
  include_chunks?: boolean;
  base64_urls?: boolean;
}

/**
 * Result structure for document processing
 */
export interface ChunkrResult {
  chunks: Chunk[];
  metadata: ChunkrMetadata;
  taskId: string;
}

/**
 * Health check response
 */
export interface ChunkrHealthResponse {
  status: string;
  version?: string;
  timestamp?: string;
}
