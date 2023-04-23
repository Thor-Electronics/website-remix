import { TrashIcon } from "@heroicons/react/24/solid"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { useState } from "react"
import { TextButton } from "~/components/atoms/Button"

export const loader: LoaderFunction = async () => {
  return { group: null }
}

export const action: ActionFunction = async () => {}

export default function DeleteGroupModal() {
  // Loader Data
  // Action Data
  // Navigation
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    // Redirect back
  }

  return (
    <div>
      {/* <div className="glossy-fullscreen-overlay"> */}
      <Dialog
        open={open}
        onClose={handleClose}
        disablePortal
        aria-labelledby="delete-group-confirmation-dialog-title"
        aria-describedby="delete-group-confirmation-dialog-description"
      >
        <DialogTitle id="delete-group-confirmation-dialog-title">
          Delete "THIS" group/building?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-group-confirmation-dialog-description">
            You're about to delete "THIS" group/building/etc. Deleting this
            group, causes all the devices to be deleted too! This action can't
            be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <TextButton onClick={handleClose}>Cancel</TextButton>
          <TextButton
            onClick={handleClose}
            className="!bg-red-500 p-2 rounded-xl sm:rounded-lg
            sm:px-3 sm:py-1 shadow-red-300 sm:shadow-red-200"
            disabled={false}
          >
            <TrashIcon className="w-4" />
            Yes, Delete!
          </TextButton>
        </DialogActions>
      </Dialog>
    </div>
    // </div>
  )
}
