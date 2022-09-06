import type { ReactElement, ReactNode } from "react";
import React, { Fragment } from 'react';
import { classNames } from '~/libs/classNames';

import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface MenuProps {
  children: ReactNode;
}

export const Menu = ({ children }: MenuProps) => {
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return (
      <HeadlessMenu.Item>
        {({ active }) =>
          React.cloneElement(child as ReactElement<any>, {
            className: classNames(
              child.props.className,
              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
              "group flex items-center px-4 py-2 text-sm"
            ),
          })
        }
      </HeadlessMenu.Item>
    );
  });
  return (
    <HeadlessMenu as="div" className="relative inline-block text-left">
      <div>
        <HeadlessMenu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          Settings
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </HeadlessMenu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">{items}</div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
};
