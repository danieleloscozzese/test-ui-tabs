import React, { type ReactNode, type FC, type PropsWithChildren } from "react";

const Panel: FC<PropsWithChildren<{ title: string }>> = ({ children }) =>
  children;

interface TabGroupProps {
  titles: string[];
  children: ReactNode[];
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
const validateTitles = (titles: string[]) => {
  const uniqueTitles = new Set(titles.map((t) => t.toLocaleLowerCase()));

  if (titles.length > uniqueTitles.size) {
    console.group("[Tabs]");
    console.warn(
      "There are duplicated titles and the navigation will not work as intended.",
    );
    console.warn(
      "Ensure that the tab titles are unique for accessibility and React performance.",
    );
    console.groupEnd();
  }
};

/**
 * Warns if there is a mismatch between the number of titles and the number of
 * panels.
 * Panels with no tab cannot be rendered.
 * Titles with no panel will render null content.
 * No error is thrown so that whichever content is valid is rendered as usual.
 */
const validatePairing = (
  numberOfTitles: number,
  numberOfPanels: number,
): void => {
  if (numberOfTitles !== numberOfPanels) {
    console.group("[Tabs]");
    console.warn("The number of titles and panels is not the same");
    console.warn(
      "A title without content will render an empty panel. A panel with no title will never be rendered.",
    );
    console.groupEnd();
  }
};

const TabGroup: FC<TabGroupProps> = ({ titles, children }) => {
  validateTitles(titles);
  validatePairing(titles.length, children.length);

  const tabs = titles.map((title) => {
    return (
      <li role="tab" key={title}>
        <button type="button">{title}</button>
      </li>
    );
  });

  const panels = children.map((panel, index) => {
    return (
      <section key={titles[index]} role="tabpanel" hidden={index > 0}>
        {panel}
      </section>
    );
  });

  return (
    <div>
      <ol role="tablist">{tabs}</ol>

      {panels}
    </div>
  );
};

export default TabGroup;
export { TabGroup, Panel };
