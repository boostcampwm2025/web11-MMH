import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HistoryItem from "./history-item";
import { MOCK_REPORTS } from "../../_constants/mock-data";

const meta: Meta<typeof HistoryItem> = {
  title: "Report/HistoryItem",
  component: HistoryItem,
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
  },
  decorators: [
    (Story) => (
      <div className="w-75">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HistoryItem>;

export const Default: Story = {
  args: {
    item: MOCK_REPORTS[1],
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    item: MOCK_REPORTS[1],
    isSelected: true,
  },
};

export const Pending: Story = {
  args: {
    item: MOCK_REPORTS[0],
    isSelected: false,
  },
};
