const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const BUCKET_NAME = process.env.target_bucket;

const s3Client = new S3Client({ region: process.env.region });

exports.handler = async (event) => {
    try {
        const uuids = Array.from({ length: 10 }, () => uuidv4());
        const payload = { ids: uuids };

        const timestamp = new Date().toISOString();
        const filename = timestamp;

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: JSON.stringify(payload, null, 4),
            ContentType: 'application/json'
        });

        await s3Client.send(command);

        console.log(`Successfully uploaded UUIDs to S3: s3://${BUCKET_NAME}/${filename}`);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
