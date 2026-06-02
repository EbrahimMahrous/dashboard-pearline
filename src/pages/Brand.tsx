import React, { useState, useMemo, useCallback, useEffect, useRef, type JSX } from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ** Icons SVG
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const LoadingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

// ** Assets
import armhammer from "../assets/AllBrands/armhammer.jpg";
import aveeno from "../assets/AllBrands/aveeno.jpg";
import AXE from "../assets/AllBrands/axe.jpg";
import Cetaphil from "../assets/AllBrands/cetaphil.jpg";
import Dettol from "../assets/AllBrands/dettol.jpg";
import Dior from "../assets/AllBrands/dior.jpg";
import Dove from "../assets/AllBrands/dove.jpg";
import Durex from "../assets/AllBrands/durex.jpg";
import Eucerin from "../assets/AllBrands/eucerin.jpg";
import Garnier from "../assets/AllBrands/garnier.jpg";
import Gillette from "../assets/AllBrands/gillette.jpg";
import HeadAndShoulders from "../assets/AllBrands/headshoulders.jpg";
import HerbalEssences from "../assets/AllBrands/herbalessences.jpg";
import Huggies from "../assets/AllBrands/huggies.jpg";
import Johnson from "../assets/AllBrands/johnsons.jpg";
import JohnsonBaby from "../assets/AllBrands/johnsonsbaby.jpg";
import Kotex from "../assets/AllBrands/kotex.jpg";
import Lifebuoy from "../assets/AllBrands/lifebouy.jpg";
import LOreal from "../assets/AllBrands/loreal.jpg";
import Lux from "../assets/AllBrands/lux.jpg";
import Nair from "../assets/AllBrands/nair.jpg";
import Neutrogena from "../assets/AllBrands/neutrogena.jpg";
import Olay from "../assets/AllBrands/olay.jpg";
import OralB from "../assets/AllBrands/oral-b.jpg";
import Palmer from "../assets/AllBrands/palmers.jpg";
import Pampers from "../assets/AllBrands/pampers.jpg";
import Pantene from "../assets/AllBrands/pantene.jpg";
import Pears from "../assets/AllBrands/pears.jpg";
import BeautyFormulas from "../assets/AllBrands/beautyformulas.jpg";
import batiste from "../assets/AllBrands/batiste.jpg";
import brushworks from "../assets/AllBrands/Brushworks.jpg";
import albertobalsam from "../assets/AllBrands/albertobalsam.jpg";
import alpecin from "../assets/AllBrands/alpecin.jpg";
import abercrombiefitch from "../assets/AllBrands/abercrombiefitch.jpg";
import afnan from "../assets/AllBrands/afnan.jpg";
import agentprovocateur from "../assets/AllBrands/agentprovocateur.jpg";
import annasui from "../assets/AllBrands/annasui.jpg";
import aramis from "../assets/AllBrands/aramis.jpg";
import bertbert from "../assets/AllBrands/bertbert.jpg";
import bic from "../assets/AllBrands/bic.jpg";
import bristows from "../assets/AllBrands/bristows.jpg";
import aussie from "../assets/AllBrands/aussie.jpg";
import emporioarmani from "../assets/AllBrands/emporioarmani.jpg";

interface Brand {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  letter?: string;
}

interface BrandFormData {
  name: string;
  image: string | File;
}

// Initial brands from assets
const initialBrandsData: Brand[] = [
  { id: 1, name: "Arm & Hammer", letter: "A", image: armhammer, createdAt: '2024-01-15' },
  { id: 2, name: "Aveeno", letter: "A", image: aveeno, createdAt: '2024-01-14' },
  { id: 3, name: "AXE", letter: "A", image: AXE, createdAt: '2024-01-13' },
  { id: 4, name: "Cetaphil", letter: "C", image: Cetaphil, createdAt: '2024-01-12' },
  { id: 5, name: "Dettol", letter: "D", image: Dettol, createdAt: '2024-01-11' },
  { id: 6, name: "Dior", letter: "D", image: Dior, createdAt: '2024-01-10' },
  { id: 7, name: "Dove", letter: "D", image: Dove, createdAt: '2024-01-09' },
  { id: 8, name: "Durex", letter: "D", image: Durex, createdAt: '2024-01-08' },
  { id: 9, name: "Eucerin", letter: "E", image: Eucerin, createdAt: '2024-01-07' },
  { id: 10, name: "Garnier", letter: "G", image: Garnier, createdAt: '2024-01-06' },
  { id: 11, name: "Gillette", letter: "G", image: Gillette, createdAt: '2024-01-05' },
  { id: 12, name: "Head & Shoulders", letter: "H", image: HeadAndShoulders, createdAt: '2024-01-04' },
  { id: 13, name: "Herbal Essences", letter: "H", image: HerbalEssences, createdAt: '2024-01-03' },
  { id: 14, name: "Huggies", letter: "H", image: Huggies, createdAt: '2024-01-02' },
  { id: 15, name: "Johnson's", letter: "J", image: Johnson, createdAt: '2024-01-01' },
  { id: 16, name: "Johnson's Baby", letter: "J", image: JohnsonBaby, createdAt: '2023-12-31' },
  { id: 17, name: "Kotex", letter: "K", image: Kotex, createdAt: '2023-12-30' },
  { id: 18, name: "Lifebuoy", letter: "L", image: Lifebuoy, createdAt: '2023-12-29' },
  { id: 19, name: "L'Oreal", letter: "L", image: LOreal, createdAt: '2023-12-28' },
  { id: 20, name: "Lux", letter: "L", image: Lux, createdAt: '2023-12-27' },
  { id: 21, name: "Nair", letter: "N", image: Nair, createdAt: '2023-12-26' },
  { id: 22, name: "Neutrogena", letter: "N", image: Neutrogena, createdAt: '2023-12-25' },
  { id: 23, name: "Olay", letter: "O", image: Olay, createdAt: '2023-12-24' },
  { id: 24, name: "Oral-B", letter: "O", image: OralB, createdAt: '2023-12-23' },
  { id: 25, name: "Palmer's", letter: "P", image: Palmer, createdAt: '2023-12-22' },
  { id: 26, name: "Pampers", letter: "P", image: Pampers, createdAt: '2023-12-21' },
  { id: 27, name: "Pantene", letter: "P", image: Pantene, createdAt: '2023-12-20' },
  { id: 28, name: "Pears", letter: "P", image: Pears, createdAt: '2023-12-19' },
  { id: 29, name: "Beauty Formulas", letter: "B", image: BeautyFormulas, createdAt: '2023-12-18' },
  { id: 30, name: "Batiste", letter: "B", image: batiste, createdAt: '2023-12-17' },
  { id: 31, name: "Brushworks", letter: "B", image: brushworks, createdAt: '2023-12-16' },
  { id: 32, name: "Alberto Balsam", letter: "A", image: albertobalsam, createdAt: '2023-12-15' },
  { id: 33, name: "Alpecin", letter: "A", image: alpecin, createdAt: '2023-12-14' },
  { id: 34, name: "Abercrombie & Fitch", letter: "A", image: abercrombiefitch, createdAt: '2023-12-13' },
  { id: 35, name: "Afnan", letter: "A", image: afnan, createdAt: '2023-12-12' },
  { id: 36, name: "Agent Provocateur", letter: "A", image: agentprovocateur, createdAt: '2023-12-11' },
  { id: 37, name: "Anna Sui", letter: "A", image: annasui, createdAt: '2023-12-10' },
  { id: 38, name: "Aramis", letter: "A", image: aramis, createdAt: '2023-12-09' },
  { id: 39, name: "Bert & Bert", letter: "B", image: bertbert, createdAt: '2023-12-08' },
  { id: 40, name: "Bic", letter: "B", image: bic, createdAt: '2023-12-07' },
  { id: 41, name: "Bristows", letter: "B", image: bristows, createdAt: '2023-12-06' },
  { id: 42, name: "Aussie", letter: "A", image: aussie, createdAt: '2023-12-05' },
  { id: 43, name: "Emporioarmani", letter: "E", image: emporioarmani, createdAt: '2023-12-04' }
];

const Brand: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(initialBrandsData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrand, setNewBrand] = useState<BrandFormData>({ name: '', image: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  const itemsPerPage = 8;

  // Filter brands based on search
  const filteredBrands = useMemo(() => {
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  // Get brands for current page
  const currentBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBrands.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBrands, currentPage, itemsPerPage]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Simulate loading
  const simulateLoading = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        resolve();
      }, 500);
    });
  }, []);

  // Handle file selection for new brand
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار ملف صورة فقط');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewBrand(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Handle file selection for editing brand
  const handleEditFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingBrand) {
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار ملف صورة فقط');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingBrand(prev => prev ? {
          ...prev,
          image: e.target?.result as string
        } : null);
      };
      reader.readAsDataURL(file);
    }
  }, [editingBrand]);

  // Handle add new brand
  const handleAddBrand = useCallback(async () => {
    if (!newBrand.name.trim()) {
      toast.error('يرجى إدخال اسم البراند');
      return;
    }

    if (!newBrand.image) {
      toast.error('يرجى اختيار صورة للبراند');
      return;
    }

    try {
      await simulateLoading();
      const brand: Brand = {
        id: Date.now(),
        name: newBrand.name.trim(),
        image: typeof newBrand.image === 'string' ? newBrand.image : '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBrands(prev => [brand, ...prev]);
      setNewBrand({ name: '', image: '' });
      setIsModalOpen(false);
      toast.success('تم إضافة البراند بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء إضافة البراند');
    }
  }, [newBrand, simulateLoading]);

  // Handle edit brand
  const handleEditBrand = useCallback(async () => {
    if (!editingBrand?.name.trim()) {
      toast.error('يرجى إدخال اسم البراند');
      return;
    }

    try {
      await simulateLoading();
      setBrands(prev =>
        prev.map(brand =>
          brand.id === editingBrand.id ? { 
            ...editingBrand, 
            name: editingBrand.name.trim()
          } : brand
        )
      );
      setEditingBrand(null);
      setIsModalOpen(false);
      toast.success('تم تحديث البراند بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث البراند');
    }
  }, [editingBrand, simulateLoading]);

  // Handle delete brand
  const handleDeleteBrand = useCallback(async (id: number) => {
    try {
      await simulateLoading();
      setBrands(prev => prev.filter(brand => brand.id !== id));
      setDeleteConfirm(null);
      toast.success('تم حذف البراند بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف البراند');
    }
  }, [simulateLoading]);

  // Open add modal
  const openAddModal = useCallback(() => {
    setEditingBrand(null);
    setNewBrand({ name: '', image: '' });
    setIsModalOpen(true);
  }, []);

  // Open edit modal
  const openEditModal = useCallback((brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  }, []);

  // Change page
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Render pagination buttons
  const renderPaginationButtons = (): JSX.Element[] => {
    const buttons: JSX.Element[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded-lg transition-all duration-200 ${
            currentPage === i
              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white'
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                إدارة البراندات
              </h1>
              <p className="text-gray-600">
                إدارة وعرض جميع البراندات في النظام
              </p>
            </div>
            
            <button
              onClick={openAddModal}
              disabled={isLoading}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin"><LoadingIcon /></span>
              ) : (
                <PlusIcon />
              )}
              إضافة براند جديد
            </button>
          </div>
        </div>

        {/* Search and Control Bar */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن براند..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800 transition-all duration-200"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>إجمالي البراندات:</span>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg font-semibold">
                {filteredBrands.length}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-center text-gray-700 font-semibold">
                    الصورة
                  </th>
                  <th className="py-4 px-6 text-center text-gray-700 font-semibold">
                    اسم البراند
                  </th>
                  <th className="py-4 px-6 text-center text-gray-700 font-semibold">
                    تاريخ الإضافة
                  </th>
                  <th className="py-4 px-6 text-center text-gray-700 font-semibold">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentBrands.map((brand, index) => (
                  <tr 
                    key={brand.id} 
                    className={`border-b border-gray-200 transition-all duration-200 hover:bg-gray-50  ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-6 ">
                      <div className="flex justify-center ">
                        <img 
                          src={brand.image} 
                          alt={brand.name}
                          className="w-20 h-10 object-contain rounded-lg border border-gray-200"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/80x40/6b7a85/ffffff?text=Error';
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-800 font-medium text-center">
                      {brand.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-center">
                      {brand.createdAt}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(brand)}
                          disabled={isLoading}
                          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <EditIcon />
                          تعديل
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(brand.id)}
                          disabled={isLoading}
                          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <DeleteIcon />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Data State */}
          {currentBrands.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl text-gray-800 font-semibold mb-2">
                لا توجد براندات
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'لم يتم العثور على براندات تطابق بحثك' : 'لم يتم إضافة أي براندات بعد'}
              </p>
              {!searchTerm && (
                <button
                  onClick={openAddModal}
                  disabled={isLoading}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  إضافة أول براند
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                السابق
              </button>
              
              {renderPaginationButtons()}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-200"
              >
                التالي
              </button>
            </div>
            
            <div className="mr-4 text-sm text-gray-600">
              الصفحة {currentPage} من {totalPages}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingBrand ? 'تعديل البراند' : 'إضافة براند جديد'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <CloseIcon />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم البراند
                  </label>
                  <input
                    type="text"
                    value={editingBrand ? editingBrand.name : newBrand.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      editingBrand 
                        ? setEditingBrand({...editingBrand, name: e.target.value})
                        : setNewBrand({...newBrand, name: e.target.value})
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-200"
                    placeholder="أدخل اسم البراند"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة البراند
                  </label>
                  <input
                    type="file"
                    ref={editingBrand ? editFileInputRef : fileInputRef}
                    onChange={editingBrand ? handleEditFileSelect : handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => editingBrand ? editFileInputRef.current?.click() : fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800 transition-all duration-200 flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <UploadIcon />
                    {editingBrand ? 'تغيير الصورة' : 'اختر صورة البراند'}
                  </button>
                </div>
                
                {(editingBrand?.image || newBrand.image) && (
                  <div className="flex justify-center">
                    <img 
                      src={editingBrand?.image || newBrand.image as string} 
                      alt="معاينة" 
                      className="w-32 h-16 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={editingBrand ? handleEditBrand : handleAddBrand}
                  disabled={isLoading || !((editingBrand?.name) || (newBrand.name && newBrand.image))}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading && <span className="animate-spin"><LoadingIcon /></span>}
                  {editingBrand ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  تأكيد الحذف
                </h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-800 mb-4">
                  هل أنت متأكد من أنك تريد حذف هذا البراند؟ هذا الإجراء لا يمكن التراجع عنه.
                </p>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDeleteBrand(deleteConfirm)}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading && <span className="animate-spin"><LoadingIcon /></span>}
                  حذف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brand;