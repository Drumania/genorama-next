import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, Heart, Users, Calendar, MessageSquare, Gift, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Genorama</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La plataforma musical que conecta artistas, bandas y fans. Descubre nueva música, 
              participa en la comunidad y apoya a los artistas que amas.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Beta</Badge>
              <span className="text-xs text-muted-foreground">Versión 1.0</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/bandas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Explorar Bandas
                </Link>
              </li>
              <li>
                <Link href="/eventos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/comunidad" className="text-muted-foreground hover:text-foreground transition-colors">
                  Comunidad
                </Link>
              </li>
              <li>
                <Link href="/donaciones" className="text-muted-foreground hover:text-foreground transition-colors">
                  Donaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ayuda" className="text-muted-foreground hover:text-foreground transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/tutoriales" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tutoriales
                </Link>
              </li>
              <li>
                <Link href="/reportar" className="text-muted-foreground hover:text-foreground transition-colors">
                  Reportar Problema
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-foreground transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-muted-foreground hover:text-foreground transition-colors">
                  DMCA
                </Link>
              </li>
              <li>
                <Link href="/licencias" className="text-muted-foreground hover:text-foreground transition-colors">
                  Licencias
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="border-t pt-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Mantente Informado</h3>
              <p className="text-sm text-muted-foreground">
                Recibe las últimas noticias sobre nuevos lanzamientos, eventos y actualizaciones de la plataforma.
              </p>
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" className="px-4">
                  Suscribirse
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Síguenos</h3>
              <p className="text-sm text-muted-foreground">
                Conecta con Genorama en las redes sociales
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                  <Youtube className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t pt-8 mb-8">
          <div className="flex justify-between gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">contacto@genorama.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">+54 11 1234-5678</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Buenos Aires, Argentina</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">            
              <span>&copy; {currentYear} Genorama. Todos los derechos reservados.</span>
              <span>•</span>
              <span>Hecho con ❤️ en Argentina</span>
            </div>
          
        </div>
      </div>
    </footer>
  )
}
