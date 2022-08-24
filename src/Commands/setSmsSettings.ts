import { CommunicationServices } from "../azure/CommunicationServices";

//Sets SMS notification Command
export async function setSmsNotificationSettings(resource: CommunicationServices) {

    const ans = await resource.verifyRequiredInfrastructure();

    if (ans) {
        const set = await resource.updateToPhoneNumber();
        if (set) {
            return true;
        }
    }
    return false;
}