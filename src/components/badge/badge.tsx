import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import ownClasses from "./badge.module.css";

type BadgeConfiguration = PropsWithChildren<{
  /**
   * @default "neutral"
   */
  variant?: "neutral" | "positive" | "negative";
}>;

/**
 * Renders a `Badge` with the given children and variant.
 * The children should be either a string or an inline element and are always
 * wrapped in a `span`.
 */
const Badge: FC<BadgeConfiguration> = ({ variant = "neutral", children }) => {
  return (
    <span
      className={classNames(ownClasses.badge, ownClasses[variant], "body s")}
    >
      {children}
    </span>
  );
};

export default Badge;
export type { BadgeConfiguration };
