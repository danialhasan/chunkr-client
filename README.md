# Chunkr API Client

A functional TypeScript client for the [Chunkr.ai](https://chunkr.ai) document processing API.

## Features

- Create document processing tasks from URLs or base64-encoded files
- Poll task status until completion
- Retrieve and filter tasks
- Extract structured document chunks and metadata
- Complete error handling and retries
- Task management (delete, cancel, update)
- API health monitoring

## Installation

```bash
npm install @legalflow/chunkr-client
```

## Configuration

Add your Chunkr API key to the `.env` file:

```env
CHUNKR_API_KEY=sk-xxxxxxxxxxxx
```

The API URL is set internally to `https://api.chunkr.ai/api/v1` by default.

## Usage Examples

### Basic Document Processing Flow

```typescript
import { runChunkrDocumentFlow } from '@legalflow/chunkr-client';

// Process a document from a URL
const processDocument = async (documentUrl: string, fileName: string) => {
  try {
    const result = await runChunkrDocumentFlow(documentUrl, fileName);

    console.log(`Processed document with ${result.chunks.length} chunks`);
    console.log(`Document metadata:`, result.metadata);

    // Use the chunks for further processing
    return result.chunks;
  } catch (error) {
    console.error('Document processing failed:', error);
    throw error;
  }
};

// Example usage:
processDocument('https://example.com/document.pdf', 'important-contract.pdf')
  .then(chunks => {
    // Do something with the chunks
  })
  .catch(error => {
    // Handle errors
  });
```

### Processing Base64-Encoded Documents

```typescript
import { runChunkrDocumentFlowFromBase64 } from '@legalflow/chunkr-client';

const processBase64Document = async (
  base64Content: string,
  fileName: string
) => {
  try {
    const result = await runChunkrDocumentFlowFromBase64(
      base64Content,
      fileName
    );
    return result.chunks;
  } catch (error) {
    console.error('Base64 document processing failed:', error);
    throw error;
  }
};
```

### Custom API URL

```typescript
import { createChunkrApiClient } from '@legalflow/chunkr-client';

// Create a client with a custom API URL
const customClient = createChunkrApiClient('https://custom-chunkr-api.example.com/v1');
```

### Advanced Configuration

```typescript
import { runChunkrDocumentFlow } from '@legalflow/chunkr-client';

// Using advanced configuration options
const result = await runChunkrDocumentFlow(documentUrl, fileName, {
  ocr_strategy: 'All',
  high_resolution: true,
  chunk_processing: {
    ignore_headers_and_footers: true,
    target_length: 1024 // Longer chunks
  }
});
```

## API Documentation

For detailed API documentation, please refer to the official [Chunkr API Documentation](https://docs.chunkr.ai).

## License

MIT 