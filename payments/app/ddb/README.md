# Local DynamoDB setup

## Docker installation

To save the state of your DynamoDB container so that it can be reused the next time you run it, you can use Docker volumes to persist data.

1. **Create a Docker Volume**: This will store the data outside the container, ensuring it persists across container restarts.
    ```sh
    docker volume create dynamodb-data
    ```

2. **Run DynamoDB Local with Volume**: Use the `docker run` command to start DynamoDB with the volume attached.
    ```sh
    docker run -d -p 8000:8000 -v dynamodb-data:/home/dynamodblocal/data amazon/dynamodb-local
    ```

This command mounts the `dynamodb-data` volume to the `/home/dynamodblocal/data` directory inside the container, where DynamoDB stores its data. This way, the data will persist even if the container is stopped or removed.

3. **Verify the Setup**: You can check if the volume is being used correctly by listing the volumes:
    ```sh
    docker volume ls
    ```

## AWS NoSQL Workbench for DynamoDB

Install NoSQL Workbench from here:

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.settingup.html


## Local Credentials

To get the local dynamodb credentials

![Local DynamoDB Credentails](images/2025-04-06-NoSQL-Workbench-LocalCredentials.png)

Add the credentials to the .env

```
AWS_ACCESS_KEY_ID=XXXXXX
AWS_SECRET_ACCESS_KEY=YYYYYYY
```

## Create the Events table



## Testing

```
cd coupons
npm install
npm run test -- ddb.test.mjs --resetModules
```

