import { AWSOfferings, GCPOfferings , GithubOfferings} from "../../Models/ConnectorOfferings.enum";

export type SecurityConnector={
   id:string, 
   name:string,
      cloudName:string,
      offerings:{
         offeringType: AWSOfferings | GCPOfferings | GithubOfferings
      }[]
   
};