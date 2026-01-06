import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Waveform from "./waveform";

const meta = {
  title: "Components/Waveform",
  component: Waveform,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Waveform>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
