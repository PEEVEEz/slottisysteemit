import prisma from "./prisma";
import { Hunt } from "../types";
import { socket } from "../socket";

export const sendLatestHuntDataToRoom = async (
  userId: string
): Promise<boolean> => {
  return socket.to(userId).emit("hunt", await getHuntDataByUserId(userId));
};

export const getHuntDataByUserId = async (id: string): Promise<Hunt | null> => {
  const hunt = await prisma?.hunt.findFirst({
    where: {
      userId: id,
    },
    select: {
      id: true,
      name: true,
      start: true,
      bonuses: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!hunt) return null;

  return calculateHuntData({
    id: hunt.id,
    name: hunt.name,
    start: hunt.start,
    bonuses: hunt.bonuses,
  });
};

export const getHuntDataById = async (id: string): Promise<Hunt | null> => {
  const hunt = await prisma?.hunt.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      start: true,
      bonuses: true,
    },
  });

  if (!hunt) return null;

  return calculateHuntData({
    id: hunt.id,
    name: hunt.name,
    start: hunt.start,
    bonuses: hunt.bonuses,
  });
};

export const calculateHuntData = (hunt: Hunt): Hunt => {
  if (!hunt.bonuses) return hunt;

  let allOpened = true;
  let start = hunt.start || 0;
  let totalWin: null | number = null;
  let totalBet: null | number = null;

  for (const bonus of hunt.bonuses) {
    if (bonus.payout !== null) {
      totalWin = (totalWin || 0) + bonus.payout;
    } else {
      allOpened = false;
    }

    if (bonus.bet) {
      totalBet = (totalBet || 0) + bonus.bet;
    }
  }

  if (!totalBet) return hunt;

  if (totalWin !== null) {
    hunt.winnings = Number(totalWin).toFixed(2);
  }

  if (allOpened || totalWin! >= start) {
    hunt.reqavg = 0;
  } else {
    hunt.reqavg = ((Number(start) - totalWin!) / totalBet!).toFixed(2);
  }

  return hunt;
};
