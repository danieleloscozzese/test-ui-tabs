import classNames from "classnames";
import React, {
  type FC,
  type PropsWithChildren,
  ReactNode,
  useId,
  useState,
} from "react";
import Badge, { type BadgeConfiguration } from "../badge";
import ownClasses from "./tab-group.module.css";

type TabConfiguration =
  | string
  | {
      label: string;
      badge?: BadgeConfiguration;
    };

/**
 * A small data structure which unifies the tab configuration into a single
 * interface, for ease of access to the string inside the `TabGroup`.
 */
class TabTitle {
  label: string;
  badge: BadgeConfiguration | undefined = undefined;

  constructor(tabConfig: TabConfiguration) {
    if (typeof tabConfig === "string") {
      this.label = tabConfig;
    } else {
      this.label = tabConfig.label;
      this.badge = tabConfig.badge;
    }
  }
}

type PanelProps = PropsWithChildren<{ title: TabConfiguration }>;

/**
 * A transparent component that provides the necessary props to render a tab
 * and its content.
 */
const Panel: FC<PanelProps> = ({ children }) => children;

interface TabGroupProps {
  accessibleTitle: string;
  tabVariant?: "pill" | "underline";
  withManualSwitching?: boolean;
  children: React.ReactElement<PanelProps, typeof Panel>[];
}

/**
 * Warns if there are non-unique titles in the collection.
 * The component does not have logic to deduplicate titles, since they should
 * not be used.
 * If they are, the navigation will not work (due to the `key` duplication)
 * but this is intentional: tabs should have unique names in order to be
 * differentiated by the user.
 * No error is thrown so that whichever content is valid is rendered as usual.
 */
const validateTitles = (titles: TabConfiguration[]) => {
  const titleTexts = titles.map((t) => {
    if (typeof t === "string") {
      return t.toLocaleLowerCase();
    } else {
      return t.label.toLocaleLowerCase();
    }
  });

  const uniqueTitles = new Set(titleTexts);

  if (titles.length > uniqueTitles.size) {
    console.group("[Tabs]");
    console.warn(
      "There are duplicated titles and the navigation will not work as intended."
    );
    console.warn(
      "Ensure that the tab titles are unique for accessibility and React performance."
    );
    console.groupEnd();
  }
};

const handleTabKeyDown = (
  evt: React.KeyboardEvent<HTMLButtonElement>,
  index: number
) => {
  const containingTabList = evt.currentTarget.parentElement?.parentElement;

  if (containingTabList?.role !== "tablist") {
    throw new Error("Broken structure, unable to proceed");
  }

  const tabButtons: NodeListOf<HTMLButtonElement> =
    containingTabList.querySelectorAll('[role="tab"] button');

  // TODO autoswitch with an override
  if (evt.key === "Home" || (evt.key === "ArrowLeft" && evt.metaKey)) {
    tabButtons[0].focus();
  } else if (evt.key === "End" || (evt.key === "ArrowRight" && evt.metaKey)) {
    tabButtons[tabButtons.length - 1].focus();
  } else if (evt.key === "ArrowRight") {
    // Loop back to the start if the focus is at the end
    if (index + 1 < tabButtons.length) {
      tabButtons[index + 1].focus();
    } else {
      tabButtons[0].focus();
    }
  } else if (evt.key === "ArrowLeft") {
    if (index > 0) {
      tabButtons[index - 1].focus();
    }
    // Loop around to the end if the focus is at the start
    else {
      tabButtons[tabButtons.length - 1].focus();
    }
  }
};

const TabGroup: FC<TabGroupProps> = ({
  accessibleTitle,
  children,
  // withManualSwitching = false,
  tabVariant = "pill",
}) => {
  const titles: TabTitle[] = new Array(children.length),
    panelContents: ReactNode[] = new Array(children.length);

  children.forEach(({ props: { title, children: panel } }, index) => {
    titles[index] = new TabTitle(title);
    panelContents[index] = panel;
  });

  validateTitles(titles);

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const pairIds: { tabId: string; panelId: string }[] = new Array(
    children.length
  ).fill({ tabId: useId(), panelId: useId() });

  const tabs = titles.map((title, index) => {
    const { tabId, panelId } = pairIds[index];

    const isSelected = index === activeTabIndex;

    return (
      <li
        key={title.label}
        role="tab"
        className={classNames(ownClasses.tab, "body m")}
        id={tabId}
        aria-controls={panelId}
        aria-selected={isSelected}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTabIndex(index);
          }}
          onKeyDown={(evt) => handleTabKeyDown(evt, index)}
          tabIndex={isSelected ? 0 : -1}
        >
          {title.label}

          {title.badge !== undefined ? (
            <Badge variant={title.badge.variant}>{title.badge.children}</Badge>
          ) : null}
        </button>
      </li>
    );
  });

  const panels = children.map((panel, index) => {
    const isSelected = index === activeTabIndex;

    return (
      <section
        key={titles[index].label}
        role="tabpanel"
        className={ownClasses.panel}
        hidden={!isSelected}
        tabIndex={isSelected ? 0 : undefined}
        aria-labelledby={pairIds[index].tabId}
        id={pairIds[index].panelId}
      >
        {panel}
      </section>
    );
  });

  return (
    <div>
      <ol
        role="tablist"
        className={classNames(ownClasses.tabList, ownClasses[tabVariant])}
        aria-label={accessibleTitle}
      >
        {tabs}
      </ol>

      {panels}
    </div>
  );
};

export default TabGroup;
export { Panel, TabGroup };
