import { useState } from "react";
import { toast } from "react-toastify";
import { FiCopy, FiCheck } from "react-icons/fi";
import Card from "../atoms/Card";
import Badge from "../atoms/Badge";
import { BASE_URL } from "../../services/httpClient";

const TOOLS = [
  ["list_cars", "Lista los vehículos de la flota."],
  ["get_car", "Detalle de un vehículo por su id."],
  ["list_reports", "Reportes de un vehículo: salidas, averías o colisiones."],
  ["fleet_summary", "Conteos de reportes y reservas por vehículo."],
  ["list_bookings", "Lista de reservas."],
];

const configSnippet = (apiUrl) =>
  JSON.stringify(
    {
      mcpServers: {
        checkcars: {
          command: "node",
          args: ["<ruta>/checkcars-mcp/src/index.js"],
          env: {
            CHECKCARS_API_URL: apiUrl || "http://localhost:8085",
            CHECKCARS_EMAIL: "tu-correo@ejemplo.com",
            CHECKCARS_PASSWORD: "tu-contraseña",
          },
        },
      },
    },
    null,
    2
  );

const McpInfo = () => {
  const [copied, setCopied] = useState(false);
  const snippet = configSnippet(BASE_URL);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success("Configuración copiada.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Servidor MCP</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            CheckCars expone un servidor <strong>Model Context Protocol</strong> que permite a asistentes de IA
            (como Claude Desktop) consultar la flota, los reportes y la analítica en lenguaje natural.
          </p>
        </div>
        <Badge tone="green">Disponible</Badge>
      </div>

      {/* Herramientas */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-700">Herramientas expuestas</h4>
        <Card padding="p-0" className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <tbody>
              {TOOLS.map(([name, desc], i) => (
                <tr key={name} className={i > 0 ? "border-t border-gray-100" : ""}>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-blue-700">{name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Configuración Claude Desktop */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-700">Configuración para Claude Desktop</h4>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
          >
            {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
          {snippet}
        </pre>
        <p className="mt-2 text-xs text-gray-400">
          Agrega este bloque a <code className="rounded bg-gray-100 px-1">claude_desktop_config.json</code>, ajusta la
          ruta y las credenciales, y reinicia Claude Desktop. Código fuente en <code className="rounded bg-gray-100 px-1">checkcars-mcp/</code>.
        </p>
      </div>
    </div>
  );
};

export default McpInfo;
