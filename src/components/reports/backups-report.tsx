import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
    Font,
} from "@react-pdf/renderer";

import { useGetReportsBackups, type GetReportsBackupsResponse } from "@/api/reports/get-reports-backups";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fromUnixTime } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

Font.register({
    family: "Helvetica",
    fonts: [
        {
            src: "Helvetica",
        },
        {
            src: "Helvetica-Bold",
            fontWeight: "bold",
        },
    ],
});

const COLORS = {
    primary: "#0F172A",
    secondary: "#334155",
    accent: "#2563EB",
    success: "#16A34A",
    danger: "#DC2626",
    border: "#CBD5E1",
    background: "#F8FAFC",
    white: "#FFFFFF",
    text: "#1E293B",
    muted: "#64748B",
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingHorizontal: 35,
        backgroundColor: COLORS.background,
        fontSize: 10,
        color: COLORS.text,
    },

    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.accent,
        paddingBottom: 12,
    },

    company: {
        fontSize: 11,
        color: COLORS.accent,
        fontWeight: "bold",
        textTransform: "uppercase",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.primary,
        marginTop: 4,
    },

    subtitle: {
        marginTop: 6,
        fontSize: 10,
        color: COLORS.muted,
    },

    section: {
        marginTop: 18,
    },

    sectionTitle: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "bold",
        marginBottom: 12,
    },

    cards: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 25,
    },

    card: {
        width: "23%",
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 10,
        alignItems: "center",
    },

    cardValue: {
        fontSize: 22,
        color: COLORS.accent,
        fontWeight: "bold",
    },

    cardLabel: {
        marginTop: 5,
        fontSize: 9,
        color: COLORS.secondary,
    },

    tableHeader: {
        flexDirection: "row",
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        paddingVertical: 7,
        paddingHorizontal: 6,
        fontSize: 9,
        fontWeight: "bold",
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
        paddingVertical: 6,
        paddingHorizontal: 6,
    },

    colSystem: {
        width: "22%",
    },

    colRetention: {
        width: "14%",
        textAlign: "center",
    },

    colExecutions: {
        width: "14%",
        textAlign: "center",
    },

    colFiles: {
        width: "30%",
        textAlign: "center",
    },

    colSize: {
        width: "25%",
        textAlign: "right",
    },

    colLast: {
        width: "20%",
        textAlign: "right",
    },

    jobCard: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginBottom: 18,
        padding: 14,
    },

    jobTitle: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: "bold",
        marginBottom: 6,
    },

    jobInfo: {
        marginBottom: 3,
        color: COLORS.secondary,
        fontSize: 9,
    },

    executionTitle: {
        marginTop: 14,
        marginBottom: 8,
        fontSize: 11,
        fontWeight: "bold",
        color: COLORS.accent,
    },

    fileHeader: {
        flexDirection: "row",
        backgroundColor: "#EFF6FF",
        padding: 6,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },

    fileRow: {
        flexDirection: "row",
        padding: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F7",
    },

    fileName: {
        width: "55%",
    },

    fileHour: {
        width: "15%",
        textAlign: "center",
    },

    fileSize: {
        width: "15%",
        textAlign: "right",
    },

    fileType: {
        width: "15%",
        textAlign: "center",
    },

    footer: {
        position: "absolute",
        bottom: 25,
        left: 35,
        right: 35,
        textAlign: "center",
        color: COLORS.muted,
        fontSize: 9,
    },
});

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function formatUnix(timestamp: number) {
    return format(
        fromUnixTime(timestamp),
        "dd/MM/yyyy HH:mm",
        {
            locale: ptBR,
        }
    );
}

const Header = ({ data }: ReportProps) => (
    <View style={styles.header}>
        <Text style={styles.company}>Nexus Gateway</Text>

        <Text style={styles.title}>
            Relatório de Backups via NAS SYNOLOGY
        </Text>

        <Text style={styles.subtitle}>
            Documento contendo backups dos últimos 7 dias gerado por {data.generatedBy} em{" "}
            {format(
                new Date(),
                "dd/MM/yyyy HH:mm:ss",
                {
                    locale: ptBR,
                }
            )}
        </Text>
    </View>
);

const Footer = () => (
    <Text
        fixed
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
            `Nexus Gateway • Relatório de Backups via NAS SYNOLOGY • Página ${pageNumber} de ${totalPages}`
        }
    />
);

type ReportProps = {
    data: GetReportsBackupsResponse;
};

const ExecutiveSummary = ({ data }: ReportProps) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                Resumo Executivo
            </Text>

            <View style={styles.cards}>

                <View style={styles.card}>
                    <Text style={styles.cardValue}>
                        7
                    </Text>

                    <Text style={styles.cardLabel}>
                        Dias Monitorados
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardValue}>
                        {data.statistics.totalBackups}
                    </Text>

                    <Text style={styles.cardLabel}>
                        Arquivos de Backup
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardValue}>
                        {formatBytes(data.statistics.totalSize)}
                    </Text>

                    <Text style={styles.cardLabel}>
                        Espaço Utilizado
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardValue}>
                        {data.backups.length}
                    </Text>

                    <Text style={styles.cardLabel}>
                        Sistemas
                    </Text>
                </View>

            </View>

            <Text
                style={{
                    fontSize: 10,
                    color: COLORS.secondary,
                    lineHeight: 1.6,
                }}
            >
                Este relatório apresenta uma visão consolidada da execução dos
                backups cadastrados no Nexus Gateway, contendo informações sobre
                quantidade de execuções, arquivos encontrados, espaço ocupado e
                detalhes individuais de cada backup monitorado.
            </Text>

        </View>
    );
};

const SystemsSummary = ({ data }: ReportProps) => {

    return (
        <View style={styles.section}>

            <Text style={styles.sectionTitle}>
                Resumo por Sistema
            </Text>

            <View style={styles.tableHeader}>

                <Text style={styles.colSystem}>
                    Sistema
                </Text>

                <Text style={styles.colFiles}>
                    Qtd de Backups / Esperado
                </Text>

                <Text style={styles.colSize}>
                    Espaço Usado
                </Text>

                <Text style={styles.colLast}>
                    Último Backup
                </Text>

            </View>

            {data.backups.map((job) => {

                const totalFiles = job.executions.reduce(
                    (acc, execution) => acc + execution.files.length,
                    0
                );

                const totalSize = job.executions.reduce(
                    (acc, execution) =>
                        acc +
                        execution.files.reduce(
                            (a, file) => a + file.size,
                            0
                        ),
                    0
                );

                const lastExecution = [...job.executions]
                    .sort((a, b) => b.updatedAt - a.updatedAt)[0];

                return (

                    <View
                        key={job.backupJob.cd_id}
                        style={styles.tableRow}
                    >

                        <Text style={styles.colSystem}>
                            {job.backupJob.ds_system}
                        </Text>

                        <Text style={styles.colFiles}>
                            {totalFiles} / {job.backupJob.nr_backups_days * 7}
                        </Text>

                        <Text style={styles.colSize}>
                            {formatBytes(totalSize)}
                        </Text>

                        <Text style={styles.colLast}>
                            {lastExecution
                                ? formatUnix(lastExecution.updatedAt)
                                : "-"}
                        </Text>

                    </View>

                );

            })}

        </View>
    );
};

const JobDetails = ({ data }: ReportProps) => (
    <>
        {data.backups.map((job) => {
            return (

                <Page
                    key={job.backupJob.cd_id}
                    size="A4"
                    style={styles.page}
                >

                    <Header data={data} />

                    <Text style={styles.sectionTitle}>
                        Detalhamento do Backup
                    </Text>

                    <View style={styles.jobCard}>

                        <Text style={styles.jobTitle}>
                            {job.backupJob.ds_system}
                        </Text>

                        <Text style={styles.jobInfo}>
                            Descrição: {job.backupJob.ds_description ?? "-"}
                        </Text>

                        <Text style={styles.jobInfo}>
                            Caminho: {job.backupJob.ds_path}
                        </Text>

                        <Text style={styles.jobInfo}>
                            Status: {job.backupJob.st_enabled ? "ATIVO" : "INATIVO"}
                        </Text>
                    </View>

                    {job.executions.map((execution) => (

                        <View
                            key={execution.path}
                            style={{
                                marginBottom: 20,
                            }}
                        >

                            <Text style={styles.executionTitle}>
                                Execução • {execution.date}
                            </Text>

                            <View style={styles.fileHeader}>

                                <Text style={styles.fileName}>
                                    Arquivo
                                </Text>

                                <Text style={styles.fileHour}>
                                    Hora
                                </Text>

                                <Text style={styles.fileSize}>
                                    Tamanho
                                </Text>

                                <Text style={styles.fileType}>
                                    Tipo
                                </Text>

                            </View>

                            {execution.files.map(file => (

                                <View
                                    key={file.path}
                                    style={styles.fileRow}
                                >

                                    <Text style={styles.fileName}>
                                        {file.name}
                                    </Text>

                                    <Text style={styles.fileHour}>
                                        {formatInTimeZone(
                                            fromUnixTime(file.updatedAt),
                                            "America/Sao_Paulo",
                                            "HH:mm:ss"
                                        )}
                                    </Text>

                                    <Text style={styles.fileSize}>
                                        {formatBytes(file.size)}
                                    </Text>

                                    <Text style={styles.fileType}>
                                        {file.type}
                                    </Text>

                                </View>

                            ))}

                        </View>

                    ))}
                    <Footer />

                </Page>

            );

        })}
    </>
);

const ConclusionPage = ({ data }: ReportProps) => {

    const ranking = [...data.backups]
        .map(job => ({
            name: job.backupJob.ds_system,
            size: job.executions.reduce(
                (acc, execution) =>
                    acc +
                    execution.files.reduce(
                        (a, file) => a + file.size,
                        0
                    ),
                0
            )
        }))
        .sort((a, b) => b.size - a.size);

    const maxSize = ranking[0]?.size || 1;

    return (

        <Page
            size="A4"
            style={styles.page}
        >

            <Header data={data} />

            <Text style={styles.sectionTitle}>
                Conclusão Executiva
            </Text>

            <Text
                style={{
                    marginBottom: 20,
                    lineHeight: 1.5,
                    color: COLORS.secondary
                }}
            >
                Este documento consolida todas as informações referentes aos
                backups armazenados no NAS Synology e cadastrados no Nexus
                Gateway.

                O relatório demonstra o volume total armazenado, quantidade de
                backups monitorados, histórico das execuções e estatísticas de
                armazenamento por sistema.
            </Text>

            <Text style={styles.sectionTitle}>
                Ranking de Consumo
            </Text>

            {ranking.map(item => (

                <View
                    key={item.name}
                    style={{
                        marginBottom: 10
                    }}
                >

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 3
                        }}
                    >

                        <Text>{item.name}</Text>

                        <Text>{formatBytes(item.size)}</Text>

                    </View>

                    <View
                        style={{
                            height: 10,
                            backgroundColor: "#E2E8F0",
                            borderRadius: 20
                        }}
                    >

                        <View
                            style={{
                                height: 10,
                                width: `${(item.size / maxSize) * 100}%`,
                                backgroundColor: COLORS.accent,
                                borderRadius: 20
                            }}
                        />

                    </View>

                </View>

            ))}
            <View
                style={{
                    marginTop: 40,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    paddingTop: 15
                }}
            >

                <Text
                    style={{
                        fontSize: 9,
                        color: COLORS.muted,
                        textAlign: "center"
                    }}
                >
                    As informações deste relatório refletem o estado dos backups existentes
                    no momento da geração deste relatório.
                </Text>

            </View>

            <Footer />

        </Page>

    );

};

const MyReport = ({ data }: ReportProps) => (

    <Document>

        <Page
            size="A4"
            style={styles.page}
        >

            <Header data={data} />

            <ExecutiveSummary
                data={data}
            />

            <SystemsSummary
                data={data}
            />

            <Footer />

        </Page>

        <JobDetails
            data={data}
        />

        <ConclusionPage
            data={data}
        />

    </Document>

);

export default function BackupsReport() {

    const {
        data,
        isLoading,
        isError,
    } = useGetReportsBackups();

    if (isLoading) {
        return <>Carregando...</>;
    }

    if (isError || !data) {
        return <>Erro ao gerar relatório.</>;
    }

    return (

        <PDFDownloadLink
            document={
                <MyReport
                    data={data}
                />
            }
            fileName={`relatorio_backups_nas_${format(
                new Date(),
                "yyyyMMdd_HHmm"
            )}.pdf`}
        >
            {({ loading }) =>
                loading
                    ? "Gerando PDF..."
                    : "Baixar Relatório"
            }
        </PDFDownloadLink>

    );
}