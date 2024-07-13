"use client";
import { ColorPicker } from "@/components/color-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import QRCodeStyling, { FileExtension, Options } from "qr-code-styling";
import React, { ChangeEvent, useEffect, useState } from "react";

const resetOption: Partial<Options> = {
  data: "https://qr.castellon.dev",
  width: 300,
  height: 300,
  image: "",
  dotsOptions: {
    color: "#09203f",
    type: "rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 20,
  },
};

export default function Home() {
  const [advance, setAdvance] = useState<boolean>(false);
  const [fileExt, setFileExt] = useState<FileExtension>("png");
  const [options, setOptions] = useState<Partial<Options>>(resetOption);
  const [image, setImage] = useState<string>(
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  );
  const [qrCode, setQrCode] = useState<QRCodeStyling>();

  useEffect(() => {
    const initQrCode = async () => {
      const QRCodeStyling = await import("qr-code-styling");
      const qr = new QRCodeStyling.default(resetOption);

      const qrCodeElement = document.querySelector("#qr-code");
      qr.append(qrCodeElement as HTMLElement);

      setQrCode(qr);
    };
    initQrCode();
  }, []);

  useEffect(() => {
    if (!qrCode) return;
    qrCode.update(options);
  }, [options]);

  const onUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setOptions((old) => ({
      ...old,
      data: url,
    }));
  };

  const onSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const size = Number(event.target.value);
    if (!(size > 0)) return;

    setOptions((old) => ({
      ...old,
      width: size,
      height: size,
    }));
  };
  const onColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setOptions((old) => ({
      ...old,
      dotsOptions: {
        ...old.dotsOptions,
        color: color,
      },
    }));
  };

  const onExtensionChange = (value: string) => {
    setFileExt(value as FileExtension);
  };

  const onDownloadClick = () => {
    if (!qrCode) return;
    qrCode.download({
      extension: fileExt,
    });
  };

  const handleImageToggle = (checked: boolean) => {
    if (checked) {
      setOptions((old) => ({
        ...old,
        image: image,
      }));
      return;
    }

    setOptions((old) => ({
      ...old,
      image: "",
    }));
  };
  function encodeImageFileAsURL(file: Blob) {
    const reader = new FileReader();
    let url = "";
    reader.onloadend = function() {
      url = reader.result as string;
      setImage(url);
      setOptions((old) => ({
        ...old,
        image: url,
      }));
    };
    reader.readAsDataURL(file);
  }

  const onImageUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFiles = event.target.files;
    if (!imageFiles) return;

    encodeImageFileAsURL(imageFiles[0]);
  };
  const onImageSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const imageSize = Number(event.target.value);
    setOptions((old) => ({
      ...old,
      imageOptions: {
        ...old.imageOptions,
        imageSize,
      },
    }));
  };

  return (
    <div className="flex flex-col justify-center max-w-xl mx-auto">
      <div className="flex justify-between">
        <h1 className="text-5xl mb-4">QR Generator</h1>
        <ThemeToggle />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl">Url</h2>
          <Input id="url-input" value={options.data} onChange={onUrlChange} />
        </div>
        <div className="flex justify-end">
          <Button variant="link" onClick={() => setAdvance((old) => !old)}>
            Advanced Options
          </Button>
        </div>
        {advance && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <h2>Style Options</h2>
              <div className="flex gap-2 items-center">
                <Label htmlFor="color-input">Color</Label>
                <ColorPicker
                  background={options.dotsOptions?.color ?? ""}
                  setBackground={(value) =>
                    onColorChange({
                      target: { value: value },
                    } as ChangeEvent<HTMLInputElement>)
                  }
                />
              </div>
              <div className="flex gap-2 items-center">
                <Label htmlFor="include-logo">With Logo</Label>
                <Switch
                  id="include-logo"
                  checked={options.image !== ""}
                  onCheckedChange={handleImageToggle}
                />
              </div>
              {options.image !== "" && (
                <>
                  <div className="flex gap-2 items-center">
                    <Label htmlFor="picture">Logo Image</Label>
                    <Input
                      id="picture"
                      type="file"
                      onChange={onImageUploadChange}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <Label htmlFor="picture-size">Logo Size</Label>
                    <Input
                      id="picture-size"
                      value={options.imageOptions?.imageSize ?? 0.4}
                      onChange={onImageSizeChange}
                    />
                  </div>
                  <Slider
                    defaultValue={[0.4]}
                    min={0.1}
                    max={1}
                    step={0.05}
                    onValueChange={(value) =>
                      onImageSizeChange({
                        target: { value: value[0].toString() },
                      } as ChangeEvent<HTMLInputElement>)
                    }
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <h2>Download Options</h2>

              <div className="flex gap-2 items-center">
                <Label htmlFor="size-input">Size</Label>
                <Input
                  id="size-input"
                  value={options.width}
                  onChange={onSizeChange}
                />
              </div>
              <Slider
                defaultValue={[resetOption.width as number]}
                min={200}
                max={500}
                step={1}
                onValueChange={(value) =>
                  onSizeChange({
                    target: { value: value[0].toString() },
                  } as ChangeEvent<HTMLInputElement>)
                }
              />
              <div className="flex gap-2 items-center">
                <Label>File Type</Label>
                <Select
                  defaultValue={fileExt}
                  onValueChange={onExtensionChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select image type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Image Extension</SelectLabel>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WEBP</SelectItem>
                      <SelectItem value="svg">SVG</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <Button onClick={onDownloadClick}>Download</Button>
      </div>

      <div className="flex justify-center my-12">
        <div id="qr-code"></div>
      </div>
    </div>
  );
}
