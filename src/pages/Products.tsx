import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getImageUrl } from "../utils/imageUrl";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ** Assets
import armhammer from "../assets/brands/armhammer.png";
import aveeno from "../assets/brands/aveeno.png";
import AXE from "../assets/brands/axe.png";
import Cetaphil from "../assets/brands/cetaphil.png";
import Dettol from "../assets/brands/dettol.png";
import Dior from "../assets/brands/dior.png";
import Dove from "../assets/brands/dove.png";
import Durex from "../assets/brands/durex.png";
import Eucerin from "../assets/brands/eucerin.png";
import Garnier from "../assets/brands/garnier.png";
import Gillette from "../assets/brands/gillette.png";
import HeadAndShoulders from "../assets/brands/headshoulders.png";
import HerbalEssences from "../assets/brands/herbalessences.png";
import Huggies from "../assets/brands/huggies.png";
import Johnson from "../assets/brands/johnsons.png";
import JohnsonBaby from "../assets/brands/johnsonsbaby.png";
import Kotex from "../assets/brands/kotex.png";
import Lifebuoy from "../assets/brands/lifebouy.png";
import LOreal from "../assets/brands/loreal.png";
import Lux from "../assets/brands/lux.png";
import Nair from "../assets/brands/nair.png";
import Neutrogena from "../assets/brands/neutrogena.png";
import Olay from "../assets/brands/olay.png";
import OralB from "../assets/brands/oral-b.png";
import Palmer from "../assets/brands/palmers.png";
import Pampers from "../assets/brands/pampers.png";
import Pantene from "../assets/brands/pantene.png";
import Pears from "../assets/brands/pears.png";
import BeautyFormulas from "../assets/brands/beautyformulas.png";
import batiste from "../assets/brands/batiste.png";
import brushworks from "../assets/brands/Brushworks.png";
import albertobalsam from "../assets/brands/albertobalsam.png";
import alpecin from "../assets/brands/alpecin.png";
import abercrombiefitch from "../assets/brands/abercrombiefitch.png";
import afnan from "../assets/brands/afnan.png";
import agentprovocateur from "../assets/brands/agentprovocateur.png";
import annasui from "../assets/brands/annasui.png";
import aramis from "../assets/brands/aramis.png";
import bertbert from "../assets/brands/bertbert.png";
import bic from "../assets/brands/bic.png";
import bristows from "../assets/brands/bristows.png";
import aussie from "../assets/brands/aussie.png";
import emporioarmani from "../assets/brands/emporioarmani.png";

interface Product {
  barcode: string;
  productName: string;
  brand: string;
  productImage: string;
  caseSize: number;
  casesPerLayer: number;
  casesPerPallet: number;
  leadTimeDays: number;
  casePrice: number;
  unitPrice: number;
  isAvailable: boolean;
  description: string;
  ingredients: string;
  usage: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}

interface Brand {
  id: number;
  name: string;
  letter: string;
  image: string;
}

const ProductsDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkJson, setBulkJson] = useState("");
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">(
    "url"
  );
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, isRTL } = useLanguage();

  const itemsPerPage = 10;

  const categories = [
    { id: 1, name: t("body_skin_care", "products") },
    { id: 2, name: t("cosmetics", "products") },
    { id: 3, name: t("hair_care", "products") },
    { id: 4, name: t("hair_removal", "products") },
    { id: 5, name: t("personal_fragrance", "products") },
  ];

  const brands: Brand[] = [
    { id: 1, name: "Arm & Hammer", letter: "A", image: armhammer },
    { id: 2, name: "Aveeno", letter: "A", image: aveeno },
    { id: 3, name: "AXE", letter: "A", image: AXE },
    { id: 4, name: "Cetaphil", letter: "C", image: Cetaphil },
    { id: 5, name: "Dettol", letter: "D", image: Dettol },
    { id: 6, name: "Dior", letter: "D", image: Dior },
    { id: 7, name: "Dove", letter: "D", image: Dove },
    { id: 8, name: "Durex", letter: "D", image: Durex },
    { id: 9, name: "Eucerin", letter: "E", image: Eucerin },
    { id: 10, name: "Garnier", letter: "G", image: Garnier },
    { id: 11, name: "Gillette", letter: "G", image: Gillette },
    { id: 12, name: "Head & Shoulders", letter: "H", image: HeadAndShoulders },
    { id: 13, name: "Herbal Essences", letter: "H", image: HerbalEssences },
    { id: 14, name: "Huggies", letter: "H", image: Huggies },
    { id: 15, name: "Johnson's", letter: "J", image: Johnson },
    { id: 16, name: "Johnson's Baby", letter: "J", image: JohnsonBaby },
    { id: 17, name: "Kotex", letter: "K", image: Kotex },
    { id: 18, name: "Lifebuoy", letter: "L", image: Lifebuoy },
    { id: 19, name: "L'Oreal", letter: "L", image: LOreal },
    { id: 20, name: "Lux", letter: "L", image: Lux },
    { id: 21, name: "Nair", letter: "N", image: Nair },
    { id: 22, name: "Neutrogena", letter: "N", image: Neutrogena },
    { id: 23, name: "Olay", letter: "O", image: Olay },
    { id: 24, name: "Oral-B", letter: "O", image: OralB },
    { id: 25, name: "Palmer's", letter: "P", image: Palmer },
    { id: 26, name: "Pampers", letter: "P", image: Pampers },
    { id: 27, name: "Pantene", letter: "P", image: Pantene },
    { id: 28, name: "Pears", letter: "P", image: Pears },
    { id: 29, name: "Beauty Formulas", letter: "B", image: BeautyFormulas },
    { id: 30, name: "Batiste", letter: "B", image: batiste },
    { id: 31, name: "Brushworks", letter: "B", image: brushworks },
    { id: 32, name: "Alberto Balsam", letter: "A", image: albertobalsam },
    { id: 33, name: "Alpecin", letter: "A", image: alpecin },
    {
      id: 34,
      name: "Abercrombie & Fitch",
      letter: "A",
      image: abercrombiefitch,
    },
    { id: 35, name: "Afnan", letter: "A", image: afnan },
    { id: 36, name: "Agent Provocateur", letter: "A", image: agentprovocateur },
    { id: 37, name: "Anna Sui", letter: "A", image: annasui },
    { id: 38, name: "Aramis", letter: "A", image: aramis },
    { id: 39, name: "Bert & Bert", letter: "B", image: bertbert },
    { id: 40, name: "Bic", letter: "B", image: bic },
    { id: 41, name: "Bristows", letter: "B", image: bristows },
    { id: 42, name: "Aussie", letter: "A", image: aussie },
    { id: 43, name: "Emporioarmani", letter: "E", image: emporioarmani },
  ];

  const emptyProduct: Product = {
    barcode: "",
    productName: "",
    brand: "",
    productImage: "",
    caseSize: 0,
    casesPerLayer: 0,
    casesPerPallet: 0,
    leadTimeDays: 0,
    casePrice: 0,
    unitPrice: 0,
    isAvailable: true,
    description: "",
    ingredients: "",
    usage: "",
    categoryId: 1,
    category: {
      id: 1,
      name: t("body_skin_care", "products"),
    },
  };

  const [newProduct, setNewProduct] = useState<Product>(emptyProduct);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/Products", {
        method: "GET",
        headers: {
          accept: "text/plain",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Product[] = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(t("failed_fetch_products", "products"));
      console.error("Error fetching products:", err);
      toast.error(t("failed_fetch_products", "products"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (activeTab !== "all") {
      const categoryId = parseInt(activeTab);
      result = result.filter((product) => product.categoryId === categoryId);
    }

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.includes(searchTerm)
      );
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [activeTab, searchTerm, products]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setUploadedImageUrl(imageUrl);
      setNewProduct({ ...newProduct, productImage: imageUrl });
    }
  };

  const addProduct = async () => {
    setIsAdding(true);
    try {
      if (uploadedImage) {
        // Use the create-with-image endpoint for image uploads
        const formData = new FormData();
        formData.append("Barcode", newProduct.barcode);
        formData.append("ProductName", newProduct.productName);
        formData.append("Brand", newProduct.brand);
        formData.append("CategoryId", newProduct.categoryId.toString());
        formData.append("UnitPrice", newProduct.unitPrice.toString());
        formData.append("Description", newProduct.description);
        formData.append("Ingredients", newProduct.ingredients);
        formData.append("Usage", newProduct.usage);
        formData.append("CaseSize", newProduct.caseSize.toString());
        formData.append("CasePrice", newProduct.casePrice.toString());
        formData.append("LeadTimeDays", newProduct.leadTimeDays.toString());
        formData.append("IsAvailable", newProduct.isAvailable.toString());
        formData.append("Image", uploadedImage);

        const response = await fetch("/api/Products/create-with-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(
            `HTTP error! status: ${response.status}, response: ${errorText}`
          );
        }
      } else {
        // Use the regular endpoint if no image is uploaded
        const response = await fetch("/api/Products", {
          method: "POST",
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Refresh products list
      await fetchProducts();
      setShowAddModal(false);
      setNewProduct(emptyProduct);
      setUploadedImage(null);
      setUploadedImageUrl("");
      toast.success(t("product_added_success", "products"));
    } catch (err) {
      setError(t("failed_add_product", "products"));
      console.error("Error adding product:", err);
      toast.error(t("failed_add_product", "products"));
    } finally {
      setIsAdding(false);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/Products/${editingProduct.barcode}`, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchProducts();
      setShowEditModal(false);
      setEditingProduct(null);
      toast.success(t("product_updated_success", "products"));
    } catch (err) {
      setError(t("failed_update_product", "products"));
      console.error("Error updating product:", err);
      toast.error(t("failed_update_product", "products"));
    }
  };

  const deleteProduct = async (barcode: string, productName: string) => {
    const result = await Swal.fire({
      title: t("delete_confirm_title", "common"),
      text: t("delete_confirm_text", "common").replace("{0}", productName),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("delete_confirm", "common"),
      cancelButtonText: t("cancel", "common"),
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/Products/${barcode}`, {
          method: "DELETE",
          headers: {
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        await fetchProducts();
        toast.success(t("product_deleted_success", "products"));
      } catch (err) {
        setError(t("failed_delete_product", "products"));
        console.error("Error deleting product:", err);
        toast.error(t("failed_delete_product", "products"));
      }
    }
  };

  const bulkAddProducts = async () => {
    try {
      const productsData = JSON.parse(bulkJson);

      const response = await fetch("/api/Products/bulk-from-json-local", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productsData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchProducts();
      setShowBulkModal(false);
      setBulkJson("");
      toast.success(t("products_added_success", "products"));
    } catch (err) {
      setError(t("failed_bulk_add", "products"));
      console.error("Error adding products:", err);
      toast.error(t("failed_bulk_add", "products"));
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <p className="text-center p-6">⏳ {t("loading_products", "products")}</p>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isRTL ? "rtl" : "ltr"}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      <div
        className={`flex justify-between items-center mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h1 className="text-2xl font-bold text-primary">
          {t("products", "products")}
        </h1>
        <div className={`flex space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
          <button
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => setShowAddModal(true)}
            disabled={isAdding}
          >
            {isAdding ? t("adding", "common") : t("add_product", "products")}
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => setShowBulkModal(true)}
          >
            {t("bulk_add_json", "products")}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">{t("error", "common")}: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}

      {/* Tab Bar*/}
      <div className="flex border-b border-light mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 font-medium whitespace-nowrap ${
            activeTab === "all"
              ? "border-b-2 border-primary text-primary"
              : "text-secondary"
          }`}
          onClick={() => setActiveTab("all")}
        >
          {t("all", "products")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === category.id.toString()
                ? "border-b-2 border-primary text-primary"
                : "text-secondary"
            }`}
            onClick={() => setActiveTab(category.id.toString())}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder={t("search_placeholder", "products")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-light rounded focus:outline-none focus:border-primary"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-accent-2">
            <tr>
              <th className="px-4 py-2 text-center">{t("image", "products")}</th>
              <th className="px-4 py-2 text-center">
                {t("barcode", "products")}
              </th>
              <th className="px-4 py-2 text-center">{t("name", "products")}</th>
              <th className="px-4 py-2 text-center">{t("brand", "products")}</th>
              <th className="px-4 py-2 text-center">
                {t("category", "products")}
              </th>
              <th className="px-4 py-2 text-center">{t("price", "products")}</th>
              <th className="px-4 py-2 text-center">{t("stock", "products")}</th>
              <th className="px-4 py-2 text-center">
                {t("actions", "products")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr
                key={product.barcode}
                className="border-t border-light hover:bg-gray-50"
              >
                <td className="px-4 py-2">
                  <img
                    src={getImageUrl(product.productImage)}
                    alt={product.productName}
                    className="w-12 h-12 object-contain"
                  />
                </td>
                <td className="px-4 py-2">{product.barcode}</td>
                <td className="px-4 py-2">{product.productName}</td>
                <td className="px-4 py-2">{product.brand}</td>
                <td className="px-4 py-2">
                  {categories.find((c) => c.id === product.categoryId)?.name}
                </td>
                <td className="px-4 py-2">£{product.casePrice.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isAvailable
                      ? t("in_stock", "products")
                      : t("out_of_stock", "products")}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => openEditModal(product)}
                  >
                    {t("edit", "products")}
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() =>
                      deleteProduct(product.barcode, product.productName)
                    }
                  >
                    {t("delete", "products")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagenation */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 items-center space-x-2">
          <button
            className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {t("prev", "products")}
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-white border border-light"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {t("next", "products")}
          </button>
        </div>
      )}

      {/* Show Results */}
      <div className="mt-4 text-sm text-gray-600">
        {t("showing_results", "products")
          .replace("{0}", paginatedProducts.length.toString())
          .replace("{1}", filteredProducts.length.toString())}
      </div>

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {t("add_new_product", "products")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("barcode", "products")} *
                </label>
                <input
                  type="text"
                  value={newProduct.barcode}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, barcode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("name", "products")} *
                </label>
                <input
                  type="text"
                  value={newProduct.productName}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("brand", "products")} *
                </label>
                <select
                  value={newProduct.brand}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, brand: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                >
                  <option value="">{t("select_brand", "products")}</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("category", "products")} *
                </label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("case_size", "products")} *
                </label>
                <input
                  type="number"
                  value={newProduct.caseSize}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      caseSize: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("cases_per_layer", "products")}
                </label>
                <input
                  type="number"
                  value={newProduct.casesPerLayer}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      casesPerLayer: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("cases_per_pallet", "products")}
                </label>
                <input
                  type="number"
                  value={newProduct.casesPerPallet}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      casesPerPallet: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("lead_time_days", "products")} *
                </label>
                <input
                  type="number"
                  value={newProduct.leadTimeDays}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      leadTimeDays: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("case_price", "products")} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.casePrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      casePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("unit_price", "products")} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.unitPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={newProduct.isAvailable}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      isAvailable: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="isAvailable" className="text-sm font-medium">
                  {t("available", "products")}
                </label>
              </div>
            </div>

            {/* Loading Images */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("product_image", "products")}
              </label>
              <div className="flex space-x-4 mb-2">
                <button
                  type="button"
                  className={`px-3 py-2 rounded ${
                    imageUploadMethod === "url"
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setImageUploadMethod("url")}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded ${
                    imageUploadMethod === "upload"
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setImageUploadMethod("upload");
                    fileInputRef.current?.click();
                  }}
                >
                  {t("upload_image", "common")}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {imageUploadMethod === "url" ? (
                <input
                  type="text"
                  value={newProduct.productImage}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productImage: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  placeholder={t("product_image_url", "products")}
                />
              ) : (
                <div>
                  {uploadedImageUrl && (
                    <div className="mb-2">
                      <img
                        src={uploadedImageUrl}
                        alt="Preview"
                        className="w-20 h-20 object-contain border rounded"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadedImage
                      ? t("change_image", "common")
                      : t("select_image", "common")}
                  </button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("description", "products")}
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-light rounded"
                rows={2}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("ingredients", "products")}
              </label>
              <textarea
                value={newProduct.ingredients}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, ingredients: e.target.value })
                }
                className="w-full px-3 py-2 border border-light rounded"
                rows={2}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("usage", "products")}
              </label>
              <textarea
                value={newProduct.usage}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, usage: e.target.value })
                }
                className="w-full px-3 py-2 border border-light rounded"
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowAddModal(false);
                  setNewProduct(emptyProduct);
                  setUploadedImage(null);
                  setUploadedImageUrl("");
                }}
              >
                {t("cancel", "products")}
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                onClick={addProduct}
                disabled={isAdding}
              >
                {isAdding
                  ? t("adding", "common")
                  : t("add_product", "products")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {t("edit_product", "products")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("barcode", "products")}
                </label>
                <input
                  type="text"
                  value={editingProduct.barcode}
                  className="w-full px-3 py-2 border border-light rounded bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("name", "products")} *
                </label>
                <input
                  type="text"
                  value={editingProduct.productName}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      productName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("brand", "products")} *
                </label>
                <select
                  value={editingProduct.brand}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      brand: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                >
                  <option value="">{t("select_brand", "products")}</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.name}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("category", "products")} *
                </label>
                <select
                  value={editingProduct.categoryId}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      categoryId: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("case_size", "products")} *
                </label>
                <input
                  type="number"
                  value={editingProduct.caseSize}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      caseSize: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("cases_per_layer", "products")}
                </label>
                <input
                  type="number"
                  value={editingProduct.casesPerLayer}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      casesPerLayer: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("cases_per_pallet", "products")}
                </label>
                <input
                  type="number"
                  value={editingProduct.casesPerPallet}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      casesPerPallet: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("lead_time_days", "products")} *
                </label>
                <input
                  type="number"
                  value={editingProduct.leadTimeDays}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      leadTimeDays: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("case_price", "products")} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.casePrice}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      casePrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("unit_price", "products")} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.unitPrice}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      unitPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-light rounded"
                  required
                  min="0"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsAvailable"
                  checked={editingProduct.isAvailable}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      isAvailable: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="editIsAvailable"
                  className="text-sm font-medium"
                >
                  {t("available", "products")}
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("product_image_url", "products")}
              </label>
              <input
                type="text"
                value={editingProduct.productImage}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    productImage: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-light rounded"
                placeholder={t("product_image_url", "products")}
              />
              {editingProduct.productImage && (
                <div className="mt-2">
                  <img
                    src={getImageUrl(editingProduct.productImage)}
                    alt="Product"
                    className="w-20 h-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("description", "products")}
              </label>
              <textarea
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-light rounded"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("ingredients", "products")}
              </label>
              <textarea
                value={editingProduct.ingredients}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    ingredients: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-light rounded"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("usage", "products")}
              </label>
              <textarea
                value={editingProduct.usage}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    usage: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-light rounded"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
              >
                {t("cancel", "products")}
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                onClick={updateProduct}
              >
                {t("update_product", "products")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bullk Jsoin Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {t("bulk_add_products_json", "products")}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t("json_data", "products")}
              </label>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                className="w-full px-3 py-2 border border-light rounded"
                rows={10}
                placeholder='[{"barcode": "123456789", "productName": "Product Name", ...}]'
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowBulkModal(false)}
              >
                {t("cancel", "products")}
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={bulkAddProducts}
              >
                {t("add_products", "products")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsDashboard;
