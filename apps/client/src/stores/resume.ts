import { createId } from "@paralleldrive/cuid2";
import { ResumeDto } from "@reactive-resume/dto";
import { CustomSection, defaultSection, SectionKey } from "@reactive-resume/schema";
import { removeItemInLayout } from "@reactive-resume/utils";
import _set from "lodash.set";
import { temporal, TemporalState } from "zundo";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { debouncedUpdateResume } from "../services/resume";

type ResumeStore = {
  resume: ResumeDto;

  // Actions
  setValue: (path: string, value: unknown) => void;

  // Custom Section Actions
  addSection: () => void;
  removeSection: (sectionId: SectionKey) => void;
};

export const useResumeStore = create<ResumeStore>()(
  temporal(
    immer((set) => ({
      resume: {} as ResumeDto,
      setValue: (path, value) => {
        set((state) => {
          if (path === "visibility") {
            state.resume.visibility = value as "public" | "private";
          } else {
            state.resume.data = _set(state.resume.data, path, value);
          }

          debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
        });
      },
      addSection: () => {
        const section: CustomSection = {
          ...defaultSection,
          id: createId(),
          name: "Custom Section",
          items: [],
        };

        set((state) => {
          state.resume.data.metadata.layout[0][0].push(`custom.${section.id}`);
          state.resume.data = _set(state.resume.data, `sections.custom.${section.id}`, section);

          debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
        });
      },
      removeSection: (sectionId: SectionKey) => {
        if (sectionId.startsWith("custom.")) {
          const id = sectionId.split("custom.")[1];

          set((state) => {
            removeItemInLayout(sectionId, state.resume.data.metadata.layout);
            delete state.resume.data.sections.custom[id];

            debouncedUpdateResume(JSON.parse(JSON.stringify(state.resume)));
          });
        }
      },
    })),
    {
      limit: 100,
      wrapTemporal: (fn) => devtools(fn),
      partialize: ({ resume }) => ({ resume }),
    },
  ),
);

export const useTemporalResumeStore = <T>(
  selector: (state: TemporalState<Pick<ResumeStore, "resume">>) => T,
  equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(useResumeStore.temporal, selector, equality);
