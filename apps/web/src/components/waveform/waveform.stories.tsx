import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Waveform from "./waveform";

const meta = {
  title: "Components/Waveform",
  component: Waveform,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    isRecording: {
      control: "boolean",
      description: "녹음 상태를 제어합니다",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
  },
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isRecording: false,
  },
};
