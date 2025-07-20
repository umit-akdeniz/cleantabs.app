import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!

export class S3Service {
  // Upload file to S3
  static async uploadFile(
    file: Buffer | Uint8Array | string,
    key: string,
    contentType: string = 'application/octet-stream'
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
      })

      await s3Client.send(command)
      return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    } catch (error) {
      console.error('Error uploading file to S3:', error)
      throw new Error('Failed to upload file')
    }
  }

  // Delete file from S3
  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })

      await s3Client.send(command)
    } catch (error) {
      console.error('Error deleting file from S3:', error)
      throw new Error('Failed to delete file')
    }
  }

  // Get presigned URL for file upload
  static async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600 // 1 hour
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      })

      return await getSignedUrl(s3Client, command, { expiresIn })
    } catch (error) {
      console.error('Error generating presigned upload URL:', error)
      throw new Error('Failed to generate upload URL')
    }
  }

  // Get presigned URL for file download
  static async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600 // 1 hour
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      })

      return await getSignedUrl(s3Client, command, { expiresIn })
    } catch (error) {
      console.error('Error generating presigned download URL:', error)
      throw new Error('Failed to generate download URL')
    }
  }

  // Upload user avatar
  static async uploadAvatar(
    userId: string,
    file: Buffer,
    contentType: string
  ): Promise<string> {
    const extension = contentType.split('/')[1]
    const key = `avatars/${userId}.${extension}`
    return await this.uploadFile(file, key, contentType)
  }

  // Upload bookmark export file
  static async uploadExport(
    userId: string,
    file: Buffer,
    filename: string
  ): Promise<string> {
    const key = `exports/${userId}/${Date.now()}-${filename}`
    return await this.uploadFile(file, key, 'text/html')
  }

  // Upload site favicon
  static async uploadFavicon(
    siteId: string,
    file: Buffer,
    contentType: string
  ): Promise<string> {
    const extension = contentType.split('/')[1]
    const key = `favicons/${siteId}.${extension}`
    return await this.uploadFile(file, key, contentType)
  }

  // Upload backup file
  static async uploadBackup(
    userId: string,
    file: Buffer,
    filename: string
  ): Promise<string> {
    const key = `backups/${userId}/${Date.now()}-${filename}`
    return await this.uploadFile(file, key, 'application/json')
  }

  // Generate file key for different types
  static generateKey(type: 'avatar' | 'export' | 'favicon' | 'backup', identifier: string, extension?: string): string {
    const timestamp = Date.now()
    
    switch (type) {
      case 'avatar':
        return `avatars/${identifier}.${extension || 'jpg'}`
      case 'export':
        return `exports/${identifier}/${timestamp}-bookmarks.html`
      case 'favicon':
        return `favicons/${identifier}.${extension || 'ico'}`
      case 'backup':
        return `backups/${identifier}/${timestamp}-backup.json`
      default:
        return `misc/${identifier}/${timestamp}`
    }
  }

  // Clean up old files (for periodic cleanup)
  static async cleanupOldFiles(prefix: string, maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    // This would typically be implemented with S3 lifecycle policies
    // or a separate cleanup service
    console.log(`Cleanup for prefix ${prefix} would be handled by lifecycle policies`)
  }
}

// Utility functions for file handling
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export const validateFileType = (contentType: string, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(contentType)
}

export const validateFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize
}

// File upload constraints
export const fileConstraints = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  favicon: {
    maxSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/x-icon', 'image/vnd.microsoft.icon', 'image/png', 'image/jpeg'],
  },
  export: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['text/html', 'application/json'],
  },
  backup: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/json'],
  },
} as const