import { AWSOfferings, GCPOfferings , GithubOfferings} from "../../Models/connectorOfferings.enum";

export type SecurityConnector={
   id:string, 
   name:string,
   properties:{
      environmentName:string,
      offerings:{
         offeringType: AWSOfferings | GCPOfferings | GithubOfferings
      }[]
   }
};