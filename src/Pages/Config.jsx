import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaUsers, FaUserShield, FaPlus, FaPlug, FaListCheck } from "react-icons/fa6";

import PageHeader from "../Components/templates/PageHeader";
import Card from "../Components/atoms/Card";
import Button from "../Components/atoms/Button";
import UsersTable from "../Components/User/UsersTable";
import UserAdd from "../Components/User/UserAdd";
import RolesManager from "../Components/organisms/RolesManager";
import McpInfo from "../Components/organisms/McpInfo";
import FormBuilder from "../Components/organisms/FormBuilder";

const tabClass =
  "flex cursor-pointer items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium text-gray-500 outline-none transition hover:text-blue-600";
const tabSelected = "!text-blue-700 border-b-2 border-blue-600 bg-blue-50/50";

const Config = () => {
  const [showAdd, setShowAdd] = useState(false);
  const usersRef = useRef(null);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PageHeader title="Configuración" />

      <Card>
        <Tabs>
          <TabList className="mb-0 flex flex-wrap gap-1 border-b border-gray-200 p-0">
            <Tab className={tabClass} selectedClassName={tabSelected}>
              <FaUsers size={15} /> Usuarios
            </Tab>
            <Tab className={tabClass} selectedClassName={tabSelected}>
              <FaUserShield size={15} /> Roles
            </Tab>
            <Tab className={tabClass} selectedClassName={tabSelected}>
              <FaListCheck size={15} /> Formularios
            </Tab>
            <Tab className={tabClass} selectedClassName={tabSelected}>
              <FaPlug size={15} /> MCP
            </Tab>
          </TabList>

          <TabPanel>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Gestiona los usuarios que pueden acceder al sistema.
                </p>
                <Button onClick={() => setShowAdd(true)} variant="outline">
                  <FaPlus size={13} /> Agregar Usuario
                </Button>
              </div>
              <UsersTable ref={usersRef} />
              {showAdd && <UserAdd onClose={() => setShowAdd(false)} onAdded={() => usersRef.current?.refresh()} />}
            </div>
          </TabPanel>

          <TabPanel>
            <div className="mt-4">
              <RolesManager />
            </div>
          </TabPanel>

          <TabPanel>
            <div className="mt-4">
              <FormBuilder />
            </div>
          </TabPanel>

          <TabPanel>
            <div className="mt-4">
              <McpInfo />
            </div>
          </TabPanel>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default Config;
