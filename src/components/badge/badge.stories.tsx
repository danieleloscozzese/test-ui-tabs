import type { Meta, StoryObj } from "@storybook/react";
import Badge from "./badge";

const config: Meta = {
  title: "Badge",
  component: Badge,
};

type Story = StoryObj<typeof config>;

const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "Badge",
  },
};

const Positive: Story = {
  args: {
    variant: "positive",
    children: "Badge",
  },
};

const Negative: Story = {
  args: {
    variant: "negative",
    children: "Badge",
  },
};

export default config;
export { Neutral, Positive, Negative };
