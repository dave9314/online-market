import Link from "next/link"
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Marketplace</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Your trusted platform for buying and selling quality used items in Ethiopia.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 transition-all"></span>
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/post-item" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 transition-all"></span>
                  Post Item
                </Link>
              </li>
              <li>
                <Link href="/my-items" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 group-hover:w-2 transition-all"></span>
                  My Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/used-vehicles" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 group-hover:w-2 transition-all"></span>
                  Vehicles
                </Link>
              </li>
              <li>
                <Link href="/category/used-electronics" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 group-hover:w-2 transition-all"></span>
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/category/used-furniture" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 group-hover:w-2 transition-all"></span>
                  Furniture
                </Link>
              </li>
              <li>
                <Link href="/category/other-used-items" className="text-sm text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 group-hover:w-2 transition-all"></span>
                  Other Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <Mail className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                <a 
                  href="mailto:dawitdegu93@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  dawitdegu93@gmail.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Phone className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                <a 
                  href="tel:+251922486497" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +251 922 486 497
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Marketplace. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
