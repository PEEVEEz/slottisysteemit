<script setup lang="ts">
import { computed, ref } from "vue";
import { Vue3Marquee } from "vue3-marquee";

type Bonus = {
  game_name: string;
  bet: number;
  payout?: number;
};

type HuntData = {
  start: number;
  winnings: number;
  reqavg: number;
  bonuses: Bonus[];
};

const huntData = ref<HuntData | null>({
  start: 501,
  winnings: 10,
  reqavg: 50,
  bonuses: [
    {
      game_name: "Wanted",
      bet: 300,
    },
  ],
});

const MAX_GAME_NAME_LENGTH = 25;
const DEFAULT_COLORS = {
  secondary: "a78bfa",
  primary: "111827",
  text: "fff",
};

type ColorKeys = keyof typeof DEFAULT_COLORS;

const getColor = (key: ColorKeys): string => {
  return `#${DEFAULT_COLORS[key]}`;
};

const fixGameName = (game_name: string) => {
  if (game_name.length > MAX_GAME_NAME_LENGTH) {
    return game_name.slice(0, MAX_GAME_NAME_LENGTH) + "...";
  }
  return game_name;
};

const openedBonusesAmount = computed(
  () =>
    huntData.value?.bonuses.filter((v) => v.payout !== undefined).length || 0
);
</script>
<template>
  <div class="flex">
    <div class="flex flex-col w-[22rem]" :style="{ color: getColor('text') }">
      <div class="flex justify-end">
        <div
          class="w-36 pt-0.5 rounded-tl text-center text-sm"
          :style="{ backgroundColor: getColor('primary') }"
        >
          START
          <span
            :style="{
              color: getColor('secondary'),
            }"
            >{{ huntData?.start ? `${huntData?.start}€` : "-" }}</span
          >
        </div>
      </div>
      <div
        class="flex flex-col h-[12rem] rounded-tl rounded-bl pb-1"
        :style="{ backgroundColor: getColor('primary') }"
      >
        <div
          class="rounded-t pl-2 border-b border-gray-700/20 py-1 pr-1 flex justify-between items-center"
        >
          <div class="text-lg">Bonustracker</div>

          <div class="flex w-36 gap-2 text-center">
            <div class="text-xs w-1/2 flex flex-col">
              <span class="uppercase">winnings</span>
              <span
                class="text-[0.7rem]"
                :style="{
                  color: getColor('secondary'),
                }"
                >{{
                  huntData?.winnings !== undefined
                    ? `${huntData?.winnings}€`
                    : "-"
                }}</span
              >
            </div>
            <div class="text-xs w-1/2 flex flex-col">
              <span class="uppercase">req avg</span>
              <span
                class="text-[0.7rem]"
                :style="{
                  color: getColor('secondary'),
                }"
                >{{
                  huntData?.reqavg !== undefined ? `${huntData?.reqavg}x` : "-"
                }}</span
              >
            </div>
          </div>
        </div>
        <Vue3Marquee
          :duration="9"
          v-if="huntData?.bonuses && huntData?.bonuses.length >= 8"
          vertical
          style="height: 100%; width: 100%; align-items: start"
          class="h-10 float-left w-full py-1 text-[0.8rem] px-2 overflow-hidden"
        >
          <div
            class="flex gap-1 justify-between w-full"
            v-for="(v, k) in huntData?.bonuses"
          >
            <div class="w-5">{{ k + 1 }}.</div>
            <div class="w-2/3">{{ fixGameName(v.game_name) }}</div>

            <div class="w-3/12 text-end">{{ v.bet }}€</div>
            <div class="w-3/12 text-end">
              {{ v.payout ? `${v.payout}€` : "" }}
            </div>
          </div>
          <div> </div>
        </Vue3Marquee>
        <div
          v-if="huntData?.bonuses && huntData?.bonuses.length <= 7"
          class="float-left w-full py-1 text-[0.8rem] px-2.5 overflow-hidden"
        >
          <div
            class="flex gap-1 justify-between w-full"
            v-for="(v, k) in huntData?.bonuses"
          >
            <div class="w-5">{{ k + 1 }}.</div>
            <div class="w-2/3">{{ fixGameName(v.game_name) }}</div>

            <div class="w-3/12 text-end">{{ v.bet }}€</div>
            <div class="w-3/12 text-end">
              {{ v.payout !== undefined ? `${v.payout}€` : "" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="huntData"
      :style="{ backgroundColor: getColor('primary') }"
      class="w-10 p-2 relative border-l border-gray-500/10 rounded-r"
    >
      <div class="w-full h-full rounded bg-white/5">
        <div
          class="w-full rounded transition-all"
          :style="{
            height:
              huntData.bonuses.length >= 0
                ? `${(openedBonusesAmount / huntData.bonuses.length) * 100}%`
                : '0%',
            background: getColor('secondary'),
          }"
        ></div>
      </div>

      <div
        class="absolute top-0 w-full left-0 h-full"
        :style="{
          color: getColor('text'),
        }"
      >
        <div class="flex h-full items-center justify-center">
          <div class="rotate-90 text-xs">
            {{ openedBonusesAmount }}/{{ huntData.bonuses.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.marquee {
  width: 100%;
}
</style>
