'use client';
import withAuth from "@/components/hoc/withAuth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

function SettingsPage() {

  const [theme, setTheme] = useState({
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#FFFFFF'
  });


  return (
    <>
      <Header />
      <Section className='pt-3'>
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="flex items-center gap-2"
              >
                <FaArrowLeft />
              </Button>
              <h1 className="text-2xl font-semibold">Configurações da Loja</h1>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nome da Loja" name='name' />
              <Input label="Banner" name='banner' type="file" />
            </div>

            <div>
              <h3 className="font-medium mb-2">Cores</h3>
              <div className="flex gap-4">
                <div className="space-y-6">
                    <ColorPicker
                    label="Cor Primária"
                    initialColor={theme.primary}
                    onColorChange={(color) => setTheme({...theme, primary: color})}
                  />
                  
                  <ColorPicker
                    label="Cor Secundária"
                    initialColor={theme.secondary}
                    onColorChange={(color) => setTheme({...theme, secondary: color})}
                  />
                  
                  <ColorPicker
                    label="Cor de Fundo"
                    initialColor={theme.background}
                    onColorChange={(color) => setTheme({...theme, background: color})}
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary">
              Salvar Configurações
            </Button>
          </form>
        </Card>
      </Section>
    </>
  );
}

export default withAuth(SettingsPage); 
