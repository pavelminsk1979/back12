import {visitsRepository} from "../repositories/visits-repository";
import {Visit, VisitWithIdMongodb} from "../allTypes/visitTypes";


export const visitLimitService = {
    async checkLimitVisits(IP: string, URL: string, date: Date) {
        const newVisit: Visit = { IP, URL, date };
        await visitsRepository.createVisit(newVisit);

        const visitsArray: VisitWithIdMongodb[] = await visitsRepository.findVisitsByIPAndURL(IP, URL);

        const timeInterval = 10 * 1000;
        const maxRequests = 5;

        const visitsForTimeInterval = visitsArray.filter(
            (elem) => date.getTime() - elem.date.getTime() < timeInterval
        );

        if (visitsForTimeInterval.length > maxRequests) return true;

        return false;
    },
};

