"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const MAX_MODEL_FILES = 10;
const MAX_MODEL_SIZE = 100 * 1024 * 1024;
const MAX_TOTAL_MODEL_SIZE = 500 * 1024 * 1024;
const MAX_REFERENCE_IMAGES = 5;

const MODEL_EXTENSIONS = [
  ".stl",
  ".obj",
  ".3mf",
  ".step",
  ".stp",
];

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");

  if (parts.length < 2) {
    return "";
  }

  return `.${parts.pop()}`;
}

function getTotalModelSize(files: File[]) {
  return files.reduce(
    (total, file) => total + file.size,
    0
  );
}

export default function CustomPrintPage() {
  const { language } = useLanguage();

  const [modelFiles, setModelFiles] = useState<File[]>([]);
  const [referenceImages, setReferenceImages] =
    useState<File[]>([]);

  const [customerName, setCustomerName] =
    useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");

  const [customColor, setCustomColor] =
    useState("");

  const [quantity, setQuantity] = useState(1);

  const [printQuality, setPrintQuality] =
    useState("");

  const [additionalNotes, setAdditionalNotes] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const text =
    language === "en"
      ? {
          heroSmall: "Custom 3D Printing",
          heroTitle: "We Print Your Ideas.",
          heroDescription:
            "Have your own 3D model? Upload it, choose your printing requirements, and we'll help bring your design to life.",

          yourInformation: "Your Information",
          contactDescription:
            "Tell us how we can contact you about your quote.",

          fullName: "Full Name",
          yourName: "Your name",
          email: "Email",
          phone: "Phone",
          phonePlaceholder: "Your phone number",

          uploadModels: "Upload Your 3D Models",
          uploadDescription:
            "Upload up to 10 models. Each file can be up to 100 MB. Total model size can be up to 500 MB.",

          clickAddModels:
            "Click to add 3D model files",

          modelLimit:
            "Up to 10 files • 100 MB each • 500 MB total",

          modelFiles: "model files",
          remove: "Remove",
          addMoreModels: "Add more 3D models",

          referenceImages: "Reference Images",

          referenceDescription:
            "Upload up to 5 JPG, PNG or WEBP images. You can add them one by one or several at once.",

          addReferenceImages:
            "Add reference images",

          addMoreImages:
            "Add more images",

          maxReferenceReached:
            "Maximum reference images reached",

          referenceSelected:
            "reference images selected.",

          noModelTitle:
            "Don't have a 3D model?",

          noModelDescription:
            "Contact us and tell us what you want to create. We'll help you find the right solution.",

          printingRequirements:
            "Printing Requirements",

          printingDescription:
            "Tell us how you'd like your model printed.",

          material: "Material",
          selectMaterial: "Select material",

          color: "Color",
          selectColor: "Select color",

          black: "Black",
          white: "White",
          gray: "Gray",
          red: "Red",
          blue: "Blue",
          green: "Green",
          yellow: "Yellow",
          orange: "Orange",
          purple: "Purple",
          pink: "Pink",
          brown: "Brown",

          customColor: "Custom color",

          customColorPlaceholder:
            "Type your color, e.g. Metallic Blue",

          quantity: "Quantity",

          printQuality: "Print Quality",
          selectPrintQuality:
            "Select print quality",

          draft: "Draft",
          standard: "Standard",
          high: "High",
          premium: "Premium",

          additionalNotes:
            "Additional Notes",

          notesPlaceholder:
            "Tell us anything else about your print...",

          reviewRequest:
            "Review Your Request",

          reviewDescription:
            "Please verify your details before sending your quote request.",

          customer: "Customer",

          name: "Name",
          notProvided: "Not provided",

          models: "3D Models",
          model: "model",
          modelsPlural: "models",
          total: "Total",
          noModelSelected:
            "No model selected",

          printing: "Printing",

          notSelected:
            "Not selected",

          quality: "Quality",

          image: "image",
          images: "images",
          selected: "selected",

          submitting:
            "Submitting Quote...",

          requestQuote:
            "Request a Quote",

          howItWorks:
            "How It Works",

          upload: "Upload",
          uploadStep:
            "Send us your 3D model and reference images.",

          review: "Review",
          reviewStep:
            "We'll review your design and requirements.",

          quote: "Quote",
          quoteStep:
            "We'll calculate the price and delivery time.",

          print: "Print",
          printStep:
            "Once approved, we'll print your design.",

          rights:
            "All rights reserved.",

          maxModelsError:
            "You have already uploaded the maximum of 10 3D model files.",

          invalidModelFormat:
            "Invalid 3D model format",

          allowedModels:
            "Allowed: STL, OBJ, 3MF, STEP and STP.",

          maxModelSize:
            "Maximum size for each model is 100 MB.",

          yourFileIs:
            "Your file is",

          totalLimitError:
            "These files would exceed the 500 MB total model upload limit. Current total:",

          maxReferenceError:
            "You have already uploaded the maximum of 5 reference images.",

          invalidImage:
            "Invalid image format. Allowed: JPG, JPEG, PNG and WEBP.",

          enterName:
            "Please enter your name.",

          enterEmail:
            "Please enter your email.",

          selectMaterialError:
            "Please select a material.",

          selectColorError:
            "Please select or enter a color.",

          selectQualityError:
            "Please select a print quality.",

          uploadModelError:
            "Please upload at least one 3D model.",

          maxModelsSubmit:
            "Maximum 10 3D model files are allowed.",

          totalSizeSubmit:
            "Total 3D model upload size cannot exceed 500 MB.",

          quantityError:
            "Quantity must be at least 1.",

          submitError:
            "Something went wrong while submitting your quote.",

          unableSubmit:
            "Unable to submit your quote request.",

          success:
            "Your quote request has been submitted successfully. We'll review your request and get back to you.",

          moreModelFile: "more 3D model file",
          moreModelFiles: "more 3D model files",

          maximumIs:
            "Maximum is 10 files.",

          moreReferenceImage:
            "more reference image",

          moreReferenceImages:
            "more reference images",

          maximumImages:
            "Maximum is 5 images.",

          tooLarge:
            "is too large.",
        }
      : {
          heroSmall: "Anpassad 3D-utskrift",
          heroTitle: "Vi skriver ut dina idéer.",
          heroDescription:
            "Har du en egen 3D-modell? Ladda upp den, välj dina utskriftskrav så hjälper vi dig att förverkliga din design.",

          yourInformation: "Dina uppgifter",
          contactDescription:
            "Berätta hur vi kan kontakta dig angående din offertförfrågan.",

          fullName: "Fullständigt namn",
          yourName: "Ditt namn",
          email: "E-post",
          phone: "Telefon",
          phonePlaceholder: "Ditt telefonnummer",

          uploadModels:
            "Ladda upp dina 3D-modeller",

          uploadDescription:
            "Ladda upp upp till 10 modeller. Varje fil får vara högst 100 MB. Den totala modellstorleken får vara högst 500 MB.",

          clickAddModels:
            "Klicka för att lägga till 3D-modellfiler",

          modelLimit:
            "Upp till 10 filer • 100 MB per fil • 500 MB totalt",

          modelFiles: "modellfiler",
          remove: "Ta bort",

          addMoreModels:
            "Lägg till fler 3D-modeller",

          referenceImages: "Referensbilder",

          referenceDescription:
            "Ladda upp upp till 5 JPG-, PNG- eller WEBP-bilder. Du kan lägga till dem en i taget eller flera samtidigt.",

          addReferenceImages:
            "Lägg till referensbilder",

          addMoreImages:
            "Lägg till fler bilder",

          maxReferenceReached:
            "Maximalt antal referensbilder har uppnåtts",

          referenceSelected:
            "referensbilder valda.",

          noModelTitle:
            "Har du ingen 3D-modell?",

          noModelDescription:
            "Kontakta oss och berätta vad du vill skapa. Vi hjälper dig att hitta rätt lösning.",

          printingRequirements:
            "Utskriftskrav",

          printingDescription:
            "Berätta hur du vill att din modell ska skrivas ut.",

          material: "Material",
          selectMaterial: "Välj material",

          color: "Färg",
          selectColor: "Välj färg",

          black: "Svart",
          white: "Vit",
          gray: "Grå",
          red: "Röd",
          blue: "Blå",
          green: "Grön",
          yellow: "Gul",
          orange: "Orange",
          purple: "Lila",
          pink: "Rosa",
          brown: "Brun",

          customColor: "Anpassad färg",

          customColorPlaceholder:
            "Skriv din färg, t.ex. Metallic Blue",

          quantity: "Antal",

          printQuality:
            "Utskriftskvalitet",

          selectPrintQuality:
            "Välj utskriftskvalitet",

          draft: "Utkast",
          standard: "Standard",
          high: "Hög",
          premium: "Premium",

          additionalNotes:
            "Ytterligare information",

          notesPlaceholder:
            "Berätta något mer om din utskrift...",

          reviewRequest:
            "Granska din förfrågan",

          reviewDescription:
            "Kontrollera dina uppgifter innan du skickar din offertförfrågan.",

          customer: "Kund",

          name: "Namn",
          notProvided:
            "Inte angivet",

          models: "3D-modeller",
          model: "modell",
          modelsPlural: "modeller",
          total: "Totalt",

          noModelSelected:
            "Ingen modell vald",

          printing: "Utskrift",

          notSelected:
            "Inte valt",

          quality: "Kvalitet",

          image: "bild",
          images: "bilder",
          selected: "valda",

          submitting:
            "Skickar offertförfrågan...",

          requestQuote:
            "Begär offert",

          howItWorks:
            "Så fungerar det",

          upload: "Ladda upp",
          uploadStep:
            "Skicka din 3D-modell och referensbilder till oss.",

          review: "Granskning",
          reviewStep:
            "Vi granskar din design och dina krav.",

          quote: "Offert",
          quoteStep:
            "Vi beräknar pris och leveranstid.",

          print: "Utskrift",
          printStep:
            "När du har godkänt offerten skriver vi ut din design.",

          rights:
            "Alla rättigheter förbehållna.",

          maxModelsError:
            "Du har redan laddat upp maximalt 10 3D-modellfiler.",

          invalidModelFormat:
            "Ogiltigt format för 3D-modell",

          allowedModels:
            "Tillåtna format: STL, OBJ, 3MF, STEP och STP.",

          maxModelSize:
            "Maximal storlek för varje modell är 100 MB.",

          yourFileIs:
            "Din fil är",

          totalLimitError:
            "Dessa filer skulle överskrida den totala uppladdningsgränsen på 500 MB. Nuvarande total:",

          maxReferenceError:
            "Du har redan laddat upp maximalt 5 referensbilder.",

          invalidImage:
            "Ogiltigt bildformat. Tillåtna format: JPG, JPEG, PNG och WEBP.",

          enterName:
            "Ange ditt namn.",

          enterEmail:
            "Ange din e-postadress.",

          selectMaterialError:
            "Välj ett material.",

          selectColorError:
            "Välj eller ange en färg.",

          selectQualityError:
            "Välj utskriftskvalitet.",

          uploadModelError:
            "Ladda upp minst en 3D-modell.",

          maxModelsSubmit:
            "Maximalt 10 3D-modellfiler är tillåtna.",

          totalSizeSubmit:
            "Den totala storleken för 3D-modeller får inte överstiga 500 MB.",

          quantityError:
            "Antalet måste vara minst 1.",

          submitError:
            "Något gick fel när offertförfrågan skickades.",

          unableSubmit:
            "Det gick inte att skicka offertförfrågan.",

          success:
            "Din offertförfrågan har skickats. Vi granskar din förfrågan och återkommer till dig.",

          moreModelFile:
            "ytterligare 3D-modellfil",

          moreModelFiles:
            "ytterligare 3D-modellfiler",

          maximumIs:
            "Maximalt 10 filer.",

          moreReferenceImage:
            "ytterligare referensbild",

          moreReferenceImages:
            "ytterligare referensbilder",

          maximumImages:
            "Maximalt 5 bilder.",

          tooLarge:
            "är för stor.",
        };

  const finalColor =
    color === "Custom"
      ? customColor.trim()
      : color;

  const totalModelSize =
    getTotalModelSize(modelFiles);

  const handleModelChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setErrorMessage("");

    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) {
      return;
    }

    const remainingSlots =
      MAX_MODEL_FILES - modelFiles.length;

    if (remainingSlots <= 0) {
      setErrorMessage(text.maxModelsError);

      event.target.value = "";
      return;
    }

    if (files.length > remainingSlots) {
      setErrorMessage(
        `${language === "en" ? "You can only add" : "Du kan bara lägga till"} ${remainingSlots} ${
          remainingSlots === 1
            ? text.moreModelFile
            : text.moreModelFiles
        }. ${text.maximumIs}`
      );

      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) => {
        const extension =
          getFileExtension(file.name);

        return !MODEL_EXTENSIONS.includes(
          extension
        );
      }
    );

    if (invalidFile) {
      setErrorMessage(
        `${text.invalidModelFormat}: ${invalidFile.name}. ${text.allowedModels}`
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) =>
        file.size > MAX_MODEL_SIZE
    );

    if (oversizedFile) {
      setErrorMessage(
        `${oversizedFile.name} ${text.tooLarge} ${text.maxModelSize} ${text.yourFileIs} ${formatFileSize(
          oversizedFile.size
        )}.`
      );

      event.target.value = "";
      return;
    }

    const newTotalSize =
      totalModelSize +
      files.reduce(
        (total, file) =>
          total + file.size,
        0
      );

    if (
      newTotalSize >
      MAX_TOTAL_MODEL_SIZE
    ) {
      setErrorMessage(
        `${text.totalLimitError} ${formatFileSize(
          totalModelSize
        )}.`
      );

      event.target.value = "";
      return;
    }

    setModelFiles((current) => [
      ...current,
      ...files,
    ]);

    event.target.value = "";
  };

  const removeModelFile = (
    index: number
  ) => {
    setModelFiles((current) =>
      current.filter(
        (_, fileIndex) =>
          fileIndex !== index
      )
    );
  };

  const handleReferenceImagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setErrorMessage("");

    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) {
      return;
    }

    const remainingSlots =
      MAX_REFERENCE_IMAGES -
      referenceImages.length;

    if (remainingSlots <= 0) {
      setErrorMessage(
        text.maxReferenceError
      );

      event.target.value = "";
      return;
    }

    if (files.length > remainingSlots) {
      setErrorMessage(
        `${language === "en" ? "You can only add" : "Du kan bara lägga till"} ${remainingSlots} ${
          remainingSlots === 1
            ? text.moreReferenceImage
            : text.moreReferenceImages
        }. ${text.maximumImages}`
      );

      event.target.value = "";
      return;
    }

    const invalidImage = files.find(
      (file) => {
        const extension =
          getFileExtension(file.name);

        return !IMAGE_EXTENSIONS.includes(
          extension
        );
      }
    );

    if (invalidImage) {
      setErrorMessage(
        text.invalidImage
      );

      event.target.value = "";
      return;
    }

    setReferenceImages((current) => [
      ...current,
      ...files,
    ]);

    event.target.value = "";
  };

  const removeReferenceImage = (
    index: number
  ) => {
    setReferenceImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!customerName.trim()) {
      setErrorMessage(text.enterName);
      return;
    }

    if (!email.trim()) {
      setErrorMessage(text.enterEmail);
      return;
    }

    if (!material) {
      setErrorMessage(
        text.selectMaterialError
      );
      return;
    }

    if (!finalColor) {
      setErrorMessage(
        text.selectColorError
      );
      return;
    }

    if (!printQuality) {
      setErrorMessage(
        text.selectQualityError
      );
      return;
    }

    if (modelFiles.length === 0) {
      setErrorMessage(
        text.uploadModelError
      );
      return;
    }

    if (
      modelFiles.length >
      MAX_MODEL_FILES
    ) {
      setErrorMessage(
        text.maxModelsSubmit
      );
      return;
    }

    if (
      totalModelSize >
      MAX_TOTAL_MODEL_SIZE
    ) {
      setErrorMessage(
        text.totalSizeSubmit
      );
      return;
    }

    if (quantity < 1) {
      setErrorMessage(
        text.quantityError
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append(
        "customerName",
        customerName.trim()
      );

      formData.append(
        "email",
        email.trim()
      );

      formData.append(
        "phone",
        phone.trim()
      );

      modelFiles.forEach((file) => {
        formData.append(
          "modelFiles",
          file
        );
      });

      referenceImages.forEach(
        (image) => {
          formData.append(
            "referenceImages",
            image
          );
        }
      );

      // IMPORTANT:
      // Backend values remain English.
      formData.append(
        "material",
        material
      );

      formData.append(
        "color",
        finalColor
      );

      formData.append(
        "quantity",
        String(quantity)
      );

      formData.append(
        "printQuality",
        printQuality
      );

      formData.append(
        "additionalNotes",
        additionalNotes.trim()
      );

      const response = await fetch(
        `${API_URL}/quotes`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(", ")
            : data?.message ||
                text.submitError
        );
      }

      setSuccessMessage(
        text.success
      );

      setModelFiles([]);
      setReferenceImages([]);

      setCustomerName("");
      setEmail("");
      setPhone("");

      setMaterial("");
      setColor("");
      setCustomColor("");

      setQuantity(1);
      setPrintQuality("");
      setAdditionalNotes("");

      const fileInputs =
        document.querySelectorAll(
          'input[type="file"]'
        );

      fileInputs.forEach((input) => {
        (
          input as HTMLInputElement
        ).value = "";
      });
    } catch (error) {
      console.error(
        "Quote submission error:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : text.unableSubmit
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps =
    language === "en"
      ? [
          {
            number: "01",
            title: text.upload,
            text: text.uploadStep,
          },
          {
            number: "02",
            title: text.review,
            text: text.reviewStep,
          },
          {
            number: "03",
            title: text.quote,
            text: text.quoteStep,
          },
          {
            number: "04",
            title: text.print,
            text: text.printStep,
          },
        ]
      : [
          {
            number: "01",
            title: text.upload,
            text: text.uploadStep,
          },
          {
            number: "02",
            title: text.review,
            text: text.reviewStep,
          },
          {
            number: "03",
            title: text.quote,
            text: text.quoteStep,
          },
          {
            number: "04",
            title: text.print,
            text: text.printStep,
          },
        ];

  return (
    <main
      className="min-h-screen transition-colors"
      style={{
        backgroundColor:
          "var(--background)",
        color:
          "var(--foreground)",
      }}
    >
      <Navbar />

      {/* HERO */}
      <section
        className="border-b transition-colors"
        style={{
          backgroundColor:
            "var(--surface-secondary)",
          borderColor:
            "var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">

          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{
              color:
                "var(--muted)",
            }}
          >
            {text.heroSmall}
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            {text.heroTitle}
          </h1>

          <p
            className="mt-5 max-w-2xl text-lg leading-8"
            style={{
              color:
                "var(--muted)",
            }}
          >
            {text.heroDescription}
          </p>

        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="px-6 py-16 sm:px-8">

          <div className="mx-auto max-w-6xl">

            {/* CUSTOMER INFORMATION */}
            <div className="mb-12">

              <h2 className="text-2xl font-bold">
                {text.yourInformation}
              </h2>

              <p
                className="mt-2"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.contactDescription}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {text.fullName}
                  </label>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(
                        event.target.value
                      )
                    }
                    placeholder={
                      text.yourName
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none transition"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      color:
                        "var(--foreground)",
                      borderColor:
                        "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {text.email}
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      color:
                        "var(--foreground)",
                      borderColor:
                        "var(--border)",
                    }}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    {text.phone}
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder={
                      text.phonePlaceholder
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none transition"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                      color:
                        "var(--foreground)",
                      borderColor:
                        "var(--border)",
                    }}
                  />
                </div>

              </div>
            </div>

            {/* MAIN TWO COLUMNS */}
            <div className="grid gap-12 lg:grid-cols-2">

              {/* MODEL UPLOAD */}
              <div>

                <h2 className="text-2xl font-bold">
                  {text.uploadModels}
                </h2>

                <p
                  className="mt-2"
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  {text.uploadDescription}
                </p>

                <label
                  htmlFor="model-file"
                  className="mt-8 flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-colors hover:opacity-80"
                  style={{
                    borderColor:
                      "var(--border)",
                    backgroundColor:
                      "var(--surface-secondary)",
                  }}
                >
                  <div
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-sm"
                    style={{
                      backgroundColor:
                        "var(--surface)",
                    }}
                  >
                    ↑
                  </div>

                  <p className="font-semibold">
                    {text.clickAddModels}
                  </p>

                  <p
                    className="mt-2 text-sm"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    STL, OBJ, 3MF, STEP or STP
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    {text.modelLimit}
                  </p>

                  <input
                    id="model-file"
                    type="file"
                    accept=".stl,.obj,.3mf,.step,.stp"
                    multiple
                    className="hidden"
                    onChange={
                      handleModelChange
                    }
                  />
                </label>

                {/* MODEL COUNTERS */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">

                  <span
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    {modelFiles.length} /{" "}
                    {MAX_MODEL_FILES}{" "}
                    {text.modelFiles}
                  </span>

                  <span
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    {formatFileSize(
                      totalModelSize
                    )}{" "}
                    / 500 MB
                  </span>

                </div>

                {/* MODEL FILE LIST */}
                {modelFiles.length > 0 && (
                  <div className="mt-5 space-y-3">

                    {modelFiles.map(
                      (file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center justify-between gap-4 rounded-xl border px-4 py-4"
                          style={{
                            borderColor:
                              "var(--border)",
                            backgroundColor:
                              "var(--surface)",
                          }}
                        >
                          <div className="min-w-0">

                            <p className="break-all text-sm font-semibold">
                              {index + 1}.{" "}
                              {file.name}
                            </p>

                            <p
                              className="mt-1 text-xs"
                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              {formatFileSize(
                                file.size
                              )}{" "}
                              •{" "}
                              {getFileExtension(
                                file.name
                              )
                                .replace(
                                  ".",
                                  ""
                                )
                                .toUpperCase()}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeModelFile(
                                index
                              )
                            }
                            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium underline"
                          >
                            {text.remove}
                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

                {/* ADD MORE MODEL */}
                {modelFiles.length > 0 &&
                  modelFiles.length <
                    MAX_MODEL_FILES && (
                    <label
                      htmlFor="model-file-more"
                      className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 transition hover:opacity-80"
                      style={{
                        borderColor:
                          "var(--border)",
                        backgroundColor:
                          "var(--surface)",
                      }}
                    >
                      <span className="text-sm font-medium">
                        {text.addMoreModels}
                      </span>

                      <span
                        className="text-sm"
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        {modelFiles.length}/
                        {MAX_MODEL_FILES}
                      </span>

                      <input
                        id="model-file-more"
                        type="file"
                        accept=".stl,.obj,.3mf,.step,.stp"
                        multiple
                        className="hidden"
                        onChange={
                          handleModelChange
                        }
                      />
                    </label>
                  )}

                {/* REFERENCE IMAGES */}
                <div className="mt-8">

                  <label className="mb-2 block text-sm font-medium">
                    {text.referenceImages}
                  </label>

                  <p
                    className="mb-4 text-sm"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    {text.referenceDescription}
                  </p>

                  {referenceImages.length <
                  MAX_REFERENCE_IMAGES ? (
                    <label
                      htmlFor="reference-images"
                      className="flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 transition hover:opacity-80"
                      style={{
                        borderColor:
                          "var(--border)",
                        backgroundColor:
                          "var(--surface)",
                      }}
                    >
                      <span className="text-sm font-medium">
                        {referenceImages.length ===
                        0
                          ? text.addReferenceImages
                          : text.addMoreImages}
                      </span>

                      <span
                        className="text-sm"
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        {referenceImages.length}/
                        {MAX_REFERENCE_IMAGES}
                      </span>

                      <input
                        id="reference-images"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        multiple
                        className="hidden"
                        onChange={
                          handleReferenceImagesChange
                        }
                      />
                    </label>
                  ) : (
                    <div
                      className="flex items-center justify-between rounded-xl border px-4 py-4"
                      style={{
                        borderColor:
                          "var(--border)",
                        backgroundColor:
                          "var(--surface-secondary)",
                      }}
                    >
                      <span className="text-sm font-medium">
                        {text.maxReferenceReached}
                      </span>

                      <span
                        className="text-sm"
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        5/5
                      </span>
                    </div>
                  )}

                  {/* IMAGE PREVIEWS */}
                  {referenceImages.length >
                    0 && (
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">

                      {referenceImages.map(
                        (
                          image,
                          index
                        ) => {
                          const previewUrl =
                            URL.createObjectURL(
                              image
                            );

                          return (
                            <div
                              key={`${image.name}-${image.size}-${index}`}
                              className="overflow-hidden rounded-2xl border"
                              style={{
                                borderColor:
                                  "var(--border)",
                                backgroundColor:
                                  "var(--surface-secondary)",
                              }}
                            >
                              <div className="relative aspect-square">

                                <img
                                  src={
                                    previewUrl
                                  }
                                  alt={`${text.referenceImages} ${
                                    index + 1
                                  }`}
                                  className="h-full w-full object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeReferenceImage(
                                      index
                                    )
                                  }
                                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                                  style={{
                                    backgroundColor:
                                      "var(--surface)",
                                    color:
                                      "var(--foreground)",
                                  }}
                                >
                                  ×
                                </button>

                              </div>

                              <div className="p-3">

                                <p className="truncate text-xs font-medium">
                                  {image.name}
                                </p>

                                <p
                                  className="mt-1 text-xs"
                                  style={{
                                    color:
                                      "var(--muted)",
                                  }}
                                >
                                  {formatFileSize(
                                    image.size
                                  )}
                                </p>

                              </div>
                            </div>
                          );
                        }
                      )}

                    </div>
                  )}

                  {referenceImages.length >
                    0 && (
                    <p
                      className="mt-4 text-sm"
                      style={{
                        color:
                          "var(--muted)",
                      }}
                    >
                      {referenceImages.length}{" "}
                      {language === "en"
                        ? "of"
                        : "av"}{" "}
                      {MAX_REFERENCE_IMAGES}{" "}
                      {text.referenceSelected}
                    </p>
                  )}

                </div>

                {/* NO MODEL */}
                <div
                  className="mt-6 rounded-2xl p-6 transition-colors"
                  style={{
                    backgroundColor:
                      "var(--surface-secondary)",
                  }}
                >
                  <h3 className="font-semibold">
                    {text.noModelTitle}
                  </h3>

                  <p
                    className="mt-2 text-sm leading-6"
                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    {text.noModelDescription}
                  </p>

                </div>
              </div>

              {/* PRINTING REQUIREMENTS */}
              <div>

                <h2 className="text-2xl font-bold">
                  {text.printingRequirements}
                </h2>

                <p
                  className="mt-2"
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  {text.printingDescription}
                </p>

                <div className="mt-8 space-y-6">

                  {/* MATERIAL */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {text.material}
                    </label>

                    <select
                      value={material}
                      onChange={(event) =>
                        setMaterial(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none transition"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                        color:
                          "var(--foreground)",
                        borderColor:
                          "var(--border)",
                      }}
                    >
                      <option value="">
                        {text.selectMaterial}
                      </option>

                      <option value="PLA">
                        PLA
                      </option>

                      <option value="PETG">
                        PETG
                      </option>

                      <option value="ABS">
                        ABS
                      </option>

                      <option value="Resin">
                        Resin
                      </option>
                    </select>
                  </div>

                  {/* COLOR */}
                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      {text.color}
                    </label>

                    <select
                      value={color}
                      onChange={(event) =>
                        setColor(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none transition"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                        color:
                          "var(--foreground)",
                        borderColor:
                          "var(--border)",
                      }}
                    >
                      <option value="">
                        {text.selectColor}
                      </option>

                      <option value="Black">
                        {text.black}
                      </option>

                      <option value="White">
                        {text.white}
                      </option>

                      <option value="Gray">
                        {text.gray}
                      </option>

                      <option value="Red">
                        {text.red}
                      </option>

                      <option value="Blue">
                        {text.blue}
                      </option>

                      <option value="Green">
                        {text.green}
                      </option>

                      <option value="Yellow">
                        {text.yellow}
                      </option>

                      <option value="Orange">
                        {text.orange}
                      </option>

                      <option value="Purple">
                        {text.purple}
                      </option>

                      <option value="Pink">
                        {text.pink}
                      </option>

                      <option value="Brown">
                        {text.brown}
                      </option>

                      <option value="Custom">
                        {text.customColor}
                      </option>
                    </select>

                    {color === "Custom" && (
                      <input
                        type="text"
                        value={customColor}
                        onChange={(event) =>
                          setCustomColor(
                            event.target.value
                          )
                        }
                        placeholder={
                          text.customColorPlaceholder
                        }
                        className="mt-3 w-full rounded-xl border px-4 py-3 outline-none transition"
                        style={{
                          backgroundColor:
                            "var(--surface)",
                          color:
                            "var(--foreground)",
                          borderColor:
                            "var(--border)",
                        }}
                      />
                    )}

                  </div>

                  {/* QUANTITY */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      {text.quantity}
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(
                          Math.max(
                            1,
                            Number(
                              event.target.value
                            ) || 1
                          )
                        )
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none transition"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                        color:
                          "var(--foreground)",
                        borderColor:
                          "var(--border)",
                      }}
                    />
                  </div>

                  {/* QUALITY */}
                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      {text.printQuality}
                    </label>

                    <select
                      value={printQuality}
                      onChange={(event) =>
                        setPrintQuality(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border px-4 py-3 outline-none transition"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                        color:
                          "var(--foreground)",
                        borderColor:
                          "var(--border)",
                      }}
                    >
                      <option value="">
                        {text.selectPrintQuality}
                      </option>

                      <option value="Draft">
                        {text.draft}
                      </option>

                      <option value="Standard">
                        {text.standard}
                      </option>

                      <option value="High">
                        {text.high}
                      </option>

                      <option value="Premium">
                        {text.premium}
                      </option>
                    </select>

                  </div>

                  {/* NOTES */}
                  <div>

                    <label className="mb-2 block text-sm font-medium">
                      {text.additionalNotes}
                    </label>

                    <textarea
                      value={
                        additionalNotes
                      }
                      onChange={(event) =>
                        setAdditionalNotes(
                          event.target.value
                        )
                      }
                      rows={5}
                      placeholder={
                        text.notesPlaceholder
                      }
                      className="w-full resize-none rounded-xl border px-4 py-3 outline-none transition"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                        color:
                          "var(--foreground)",
                        borderColor:
                          "var(--border)",
                      }}
                    />

                  </div>

                </div>
              </div>
            </div>

            {/* REVIEW */}
            {(modelFiles.length > 0 ||
              customerName ||
              email ||
              material ||
              finalColor ||
              printQuality) && (
              <div
                className="mt-16 rounded-3xl border p-8"
                style={{
                  borderColor:
                    "var(--border)",
                  backgroundColor:
                    "var(--surface-secondary)",
                }}
              >

                <h2 className="text-2xl font-bold">
                  {text.reviewRequest}
                </h2>

                <p
                  className="mt-2"
                  style={{
                    color:
                      "var(--muted)",
                  }}
                >
                  {text.reviewDescription}
                </p>

                <div className="mt-8 grid gap-8 md:grid-cols-2">

                  {/* CUSTOMER */}
                  <div>

                    <h3 className="font-semibold">
                      {text.customer}
                    </h3>

                    <div className="mt-3 space-y-1 text-sm">

                      <p>
                        <strong>
                          {text.name}:
                        </strong>{" "}
                        {customerName ||
                          text.notProvided}
                      </p>

                      <p>
                        <strong>
                          {text.email}:
                        </strong>{" "}
                        {email ||
                          text.notProvided}
                      </p>

                      <p>
                        <strong>
                          {text.phone}:
                        </strong>{" "}
                        {phone ||
                          text.notProvided}
                      </p>

                    </div>
                  </div>

                  {/* MODEL */}
                  <div>

                    <h3 className="font-semibold">
                      {text.models}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm">

                      {modelFiles.length >
                      0 ? (
                        <>
                          {modelFiles.map(
                            (
                              file,
                              index
                            ) => (
                              <div
                                key={`${file.name}-${file.size}-${index}`}
                                className="flex justify-between gap-4"
                              >
                                <span className="break-all">
                                  {index + 1}.{" "}
                                  {file.name}
                                </span>

                                <span
                                  className="shrink-0"
                                  style={{
                                    color:
                                      "var(--muted)",
                                  }}
                                >
                                  {formatFileSize(
                                    file.size
                                  )}
                                </span>
                              </div>
                            )
                          )}

                          <p
                            className="pt-2 font-medium"
                            style={{
                              color:
                                "var(--muted)",
                            }}
                          >
                            {modelFiles.length}{" "}
                            {modelFiles.length ===
                            1
                              ? text.model
                              : text.modelsPlural}{" "}
                            • {text.total}{" "}
                            {formatFileSize(
                              totalModelSize
                            )}
                          </p>
                        </>
                      ) : (
                        <p
                          style={{
                            color:
                              "var(--muted)",
                          }}
                        >
                          {text.noModelSelected}
                        </p>
                      )}

                    </div>
                  </div>

                  {/* PRINTING */}
                  <div>

                    <h3 className="font-semibold">
                      {text.printing}
                    </h3>

                    <div className="mt-3 space-y-1 text-sm">

                      <p>
                        <strong>
                          {text.material}:
                        </strong>{" "}
                        {material ||
                          text.notSelected}
                      </p>

                      <p>
                        <strong>
                          {text.color}:
                        </strong>{" "}
                        {finalColor ||
                          text.notSelected}
                      </p>

                      <p>
                        <strong>
                          {text.quantity}:
                        </strong>{" "}
                        {quantity}
                      </p>

                      <p>
                        <strong>
                          {text.quality}:
                        </strong>{" "}
                        {printQuality ||
                          text.notSelected}
                      </p>

                    </div>
                  </div>

                  {/* REFERENCE */}
                  <div>

                    <h3 className="font-semibold">
                      {text.referenceImages}
                    </h3>

                    <p
                      className="mt-3 text-sm"
                      style={{
                        color:
                          "var(--muted)",
                      }}
                    >
                      {referenceImages.length}{" "}
                      {referenceImages.length ===
                      1
                        ? text.image
                        : text.images}{" "}
                      {text.selected}
                    </p>

                  </div>

                </div>
              </div>
            )}

            {/* ERROR */}
            {errorMessage && (
              <div
                className="mt-10 rounded-xl border px-5 py-4 text-sm"
                style={{
                  borderColor:
                    "var(--border)",
                  backgroundColor:
                    "var(--surface-secondary)",
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* SUCCESS */}
            {successMessage && (
              <div
                className="mt-10 rounded-xl border px-5 py-4 text-sm"
                style={{
                  borderColor:
                    "var(--border)",
                  backgroundColor:
                    "var(--surface-secondary)",
                }}
              >
                {successMessage}
              </div>
            )}

            {/* SUBMIT */}
            <div className="mt-10 flex justify-center">

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl px-8 py-4 text-sm font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor:
                    "var(--foreground)",
                  color:
                    "var(--background)",
                }}
              >
                {isSubmitting
                  ? text.submitting
                  : text.requestQuote}
              </button>

            </div>

            {/* HOW IT WORKS */}
            <div
              className="mt-20 border-t pt-16"
              style={{
                borderColor:
                  "var(--border)",
              }}
            >

              <h2 className="text-2xl font-bold">
                {text.howItWorks}
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-4">

                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-2xl border p-6"
                    style={{
                      borderColor:
                        "var(--border)",
                      backgroundColor:
                        "var(--surface)",
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color:
                          "var(--muted)",
                      }}
                    >
                      {step.number}
                    </p>

                    <h3 className="mt-3 font-semibold">
                      {step.title}
                    </h3>

                    <p
                      className="mt-2 text-sm leading-6"
                      style={{
                        color:
                          "var(--muted)",
                      }}
                    >
                      {step.text}
                    </p>

                  </div>
                ))}

              </div>
            </div>

          </div>
        </section>
      </form>

      {/* FOOTER */}
      <footer
        className="border-t px-6 py-10 text-center"
        style={{
          borderColor:
            "var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl">

          <div
            className="text-sm"
            style={{
              color:
                "var(--muted)",
            }}
          >
            © 2026 RD nordform AB.{" "}
            {text.rights}
          </div>

        </div>
      </footer>

    </main>
  );
}