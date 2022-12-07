import {
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    Text,
    DrawerBody,
} from "@chakra-ui/react";
import { ReactNode } from "react";

export default function DrawerWrapper({
    children,
    isOpen,
    onClose,
}: {
    children: ReactNode;
    isOpen: any;
    onClose: any;
}) {
    return (
        <>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent maxW={["100%", "50%"]} px="1rem">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" mt="1rem">
                        <Text>Add new admin</Text>
                    </DrawerHeader>
                    <DrawerBody>{children}</DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
