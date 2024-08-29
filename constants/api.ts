// api.ts
import dummyResponse from "./dummyResponse";

export interface Home {
  id: string;
  address: string;
  image: string;
  description: string;
  detailedDescription: string;
  unlocked: boolean;
}

export const fetchHomes = async (): Promise<Home[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyResponse);
    }, 1000);
  });
};
