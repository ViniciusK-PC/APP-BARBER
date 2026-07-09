import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout, ClientLayout } from "./components/AppLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Agenda } from "./pages/Agenda";
import { ChatPage, ClientBooking, ClientHome, ProfilePage, StorePage } from "./pages/ClientApp";
import { Dashboard } from "./pages/Dashboard";
import { Finance } from "./pages/Finance";
import { Login } from "./pages/Login";
import { Commands, ModulePage, Reports } from "./pages/ModulePage";
import { ResourcePage } from "./pages/ResourcePage";
import { Settings } from "./pages/Settings";
import { Wizard } from "./pages/Wizard";

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/wizard" element={<Wizard />} />
    <Route element={<ProtectedRoute roles={["admin", "professional"]} />}>
      <Route element={<AppLayout />}>
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/clientes" element={<ResourcePage type="clientes" />} />
        <Route path="/profissionais" element={<ResourcePage type="profissionais" />} />
        <Route path="/servicos" element={<ResourcePage type="servicos" />} />
        <Route path="/produtos" element={<ResourcePage type="produtos" />} />
        <Route path="/comandas" element={<Commands />} />
        <Route path="/financeiro" element={<Finance />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/pacotes" element={<ResourcePage type="pacotes" />} />
        <Route path="/fornecedores" element={<ResourcePage type="fornecedores" />} />
        <Route path="/formas-pagamento" element={<ResourcePage type="formas_pagamento" />} />
        <Route path="/categorias-financeiras" element={<ResourcePage type="categorias_financeiras" />} />
        <Route path="/cupons" element={<ResourcePage type="cupons" />} />
        <Route path="/assinaturas" element={<ResourcePage type="assinaturas" />} />
        <Route path="/noticias" element={<ResourcePage type="noticias" />} />
        <Route path="/mensagens" element={<ResourcePage type="mensagens" />} />
        <Route path="/modulo/:slug" element={<ModulePage />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute roles={["client"]} />}>
      <Route path="/app" element={<ClientLayout />}>
        <Route index element={<ClientHome />} />
        <Route path="agendar" element={<ClientBooking />} />
        <Route path="loja" element={<StorePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>
    </Route>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>;
}
