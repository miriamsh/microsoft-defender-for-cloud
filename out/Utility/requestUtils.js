"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export type nRequest = WebResource & requestPromise.RequestPromiseOptions;
//tslint:disable-next-line: no-any
// export async function request(credentials: AzExtServiceClientCredentials, url: string, method: HttpMethods, queryParameters?: { [key: string]: any | ParameterValue }, body?: any): Promise<HttpOperationResponse> {
//     const clientInfo:AzExtGenericClientInfo={
//         credentials:credentials,
//     };
//     const client: ServiceClient = await createGenericClient(credentials);
//     return await client.sendRequest({
//         method: method,
//         url: url,
//         queryParameters: queryParameters,
//         body: body
//     });
// }
// export async function sendRequest<T>(httpReq: nRequest): Promise<T> {
//     return await <Thenable<T>>requestPromise(httpReq).promise();
// }
// // tslint:disable: no-unsafe-any
// export async function getBearerToken(url: string, method: HttpMethods, credentials: TokenCredentialsBase): Promise<string> {
//     const requestOptions: WebResource = new WebResource();
//     requestOptions.headers.set("User-Agent", appendExtensionUserAgent());
//     requestOptions.url = url;
//     requestOptions.method = method;
//     try {
//         await credentials.signRequest(requestOptions);
//     } catch (err) {
//         throw err;
//     }
//     const headers = requestOptions.headers;
//     // tslint:disable-next-line: no-string-literal
//     const authToken : string = headers['authorization'];
//     if (authToken === undefined) {
//         throw new Error("Authorization header is missing");
//     } else {
//         return authToken;
//     }
// }
//# sourceMappingURL=requestUtils.js.map