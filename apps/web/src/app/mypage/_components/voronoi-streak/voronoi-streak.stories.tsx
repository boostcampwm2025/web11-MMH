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
    imageSrc: "/starry-night.jpg",
    streakCount: 0,
  },
  decorators: [
    (Story) => (
      <div className="w-150 h-100">
        <Story />
      </div>
    ),
  ],
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
