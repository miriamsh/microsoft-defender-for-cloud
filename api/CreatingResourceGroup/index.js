// import { ResourceManagementClient } from '@azure/arm-resources';
// import { DefaultAzureCredential } from "@azure/identity";

module.exports = async function (context, req) {
    //context.log('JavaScript HTTP trigger function processed a request.');

    // const client = new ResourceManagementClient(new DefaultAzureCredential(), '9355a384-3349-404c-9589-1796edfdf799');
    // const re = await client.resourceGroups.createOrUpdate("HereYouDoIt", { location: eastus });
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Notify, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};