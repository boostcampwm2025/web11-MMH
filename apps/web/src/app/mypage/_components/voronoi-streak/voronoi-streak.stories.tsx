import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import VoronoiStreak from "./voronoi-streak";

const meta = {
  title: "Components/VoronoiStreak",
  component: VoronoiStreak,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: { type: "number", min: 200, max: 1000, step: 50 },
      description: "캔버스 너비",
    },
    height: {
      control: { type: "number", min: 200, max: 800, step: 50 },
      description: "캔버스 높이",
    },
    imageSrc: {
      control: "text",
      description: "배경 이미지 URL",
    },
    streakCount: {
      control: { type: "range", min: 0, max: 365, step: 1 },
      description: "스트릭 일수 (0-365)",
    },
  },
  args: {
    width: 600,
    height: 400,
    imageSrc: "/starry-night.jpg",
    streakCount: 0,
  },
} satisfies Meta<typeof VoronoiStreak>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Day1: Story = {
  args: {
    streakCount: 1,
  },
};

export const Day30: Story = {
  args: {
    streakCount: 30,
  },
};

export const Day180: Story = {
  args: {
    streakCount: 180,
  },
};

export const Day365: Story = {
  args: {
    streakCount: 365,
  },
};
