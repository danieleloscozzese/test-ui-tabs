import type { Meta, StoryObj } from "@storybook/react";
import Component from "./badge";

const config: Meta = {
  title: "Badge",
  component: Component,
  args: {
    children: "Badge",
    variant: "neutral",
  },
};

type Story = StoryObj<typeof config>;

const Badge: Story = {
  args: {},
};

const Neutral: Story = {
  args: { variant: "neutral" },
};

const Positive: Story = {
  args: { variant: "positive" },
};

const Negative: Story = {
  args: { variant: "negative" },
};

export default config;
export { Badge, Neutral, Positive, Negative };
