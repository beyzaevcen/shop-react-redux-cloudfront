## Deployment

CloudFront URL: https://d30pmw471kjcb9.cloudfront.net
S3 Website URL: http://shop-aws-course.s3-website-us-east-1.amazonaws.com

## Product Service

- Frontend PLP endpoint: `GET /products`
- Default Product API base URL: `https://7b4a1qjqz2.execute-api.us-east-1.amazonaws.com/prod`
- Override locally with `VITE_PRODUCT_API_URL`

## Import Service

- Product CSV import endpoint: `GET /import?name=<file-name>.csv`
- Default Import API base URL: `https://qowmrqhjp1.execute-api.us-east-1.amazonaws.com/prod`
- Override locally with `VITE_IMPORT_API_URL`
- Copy `.env.example` to `.env.local` to set local frontend API URLs
