import {
  CopySimple,
  DotsThreeVertical,
  FolderOpen,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
import { ResumeDto } from "@reactive-resume/dto";
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@reactive-resume/ui";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useResumePreview } from "@/client/services/resume/preview";
import { useDialog } from "@/client/stores/dialog";

import { BaseListItem } from "./base-item";

type Props = {
  resume: ResumeDto;
};

export const ResumeListItem = ({ resume }: Props) => {
  const navigate = useNavigate();
  const { open } = useDialog<ResumeDto>("resume");

  const { url } = useResumePreview(resume.id);

  const lastUpdated = dayjs().to(resume.updatedAt);

  const onOpen = () => {
    navigate(`/builder/${resume.id}`);
  };

  const onUpdate = () => {
    open("update", { id: "resume", item: resume });
  };

  const onDuplicate = () => {
    open("duplicate", { id: "resume", item: resume });
  };

  const onDelete = () => {
    open("delete", { id: "resume", item: resume });
  };

  const dropdownMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="aspect-square">
        <Button size="icon" variant="ghost">
          <DotsThreeVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          <FolderOpen size={14} className="mr-2" />
          Open
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onUpdate();
          }}
        >
          <PencilSimple size={14} className="mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation();
            onDuplicate();
          }}
        >
          <CopySimple size={14} className="mr-2" />
          Duplicate
        </DropdownMenuItem>
        <ContextMenuSeparator />
        <DropdownMenuItem
          className="text-error"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <TrashSimple size={14} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger className="even:bg-secondary/20">
        <HoverCard>
          <HoverCardTrigger>
            <BaseListItem
              onClick={onOpen}
              className="group"
              title={resume.title}
              description={`Last updated ${lastUpdated}`}
              end={dropdownMenu}
            />
          </HoverCardTrigger>
          <HoverCardContent align="end" className="p-0" sideOffset={-100} alignOffset={100}>
            <AnimatePresence>
              {url && (
                <motion.img
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={url}
                  loading="lazy"
                  alt={resume.title}
                  className="aspect-[1/1.4142] w-60 rounded-sm object-cover"
                />
              )}
            </AnimatePresence>
          </HoverCardContent>
        </HoverCard>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={onOpen}>
          <FolderOpen size={14} className="mr-2" />
          Open
        </ContextMenuItem>
        <ContextMenuItem onClick={onUpdate}>
          <PencilSimple size={14} className="mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <CopySimple size={14} className="mr-2" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-error">
          <TrashSimple size={14} className="mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
