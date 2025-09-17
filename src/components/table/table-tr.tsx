import { ActionIcon, CopyButton, Table, Text, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface TdProps {
    mw?: number;
    children?: React.ReactNode;
    text?: string;
    textWithCopy?: boolean;
    textWithTooltip?: boolean;
};

interface TrProps {
    trKey: string;
    tds: TdProps[];
}

export default function Tr({ trKey, tds }: TrProps) {
    return (
        <Table.Tr key={trKey}>
            {tds.map((td, index) => {
                return (
                    <Table.Td key={index} style={{ maxWidth: td.mw }}>
                        {td.text && !td.children && !td.textWithTooltip && !td.textWithCopy && <Text size='xs'>{td.text}</Text>}
                        {td.text && td.textWithCopy &&
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {td.textWithTooltip && <Tooltip withArrow style={{ fontSize: '12px' }} label={td.text}><Text size='xs' truncate="end">{td.text}</Text></Tooltip>}
                                <CopyButton value={td.text} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                        </ActionIcon>
                                    )}
                                </CopyButton>
                            </div>
                        }
                        {!td.text && td.children}
                    </Table.Td>
                );
            })}
        </Table.Tr>
    );
}