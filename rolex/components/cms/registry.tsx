import type { ComponentType } from "react"
import { CoverParallaxFullscreen } from "@/components/sections/cover-parallax-fullscreen"
import { CoverVideo } from "@/components/sections/cover-video"
import { CoverImage } from "@/components/sections/cover-image"
import { ArticleSimple } from "@/components/sections/article-simple"
import { ArticleImageScrolling } from "@/components/sections/article-image-scrolling"
import { Fragainer } from "@/components/sections/fragainer"
import { DualGrid, DualGridCard } from "@/components/sections/dual-grid"
import { VideoPlayer, VideoPlayerExpand } from "@/components/sections/video-player"
import { RollerGallery } from "@/components/sections/roller-gallery"
import { RollerRef } from "@/components/sections/roller-ref"
import { CardVerticalCarousel, CardVerticalCarouselCard } from "@/components/sections/card-vertical-carousel"
import { WatchDrag } from "@/components/sections/watch-drag"
import { NextChapter } from "@/components/sections/next-chapter"
import { Push } from "@/components/sections/push"
import { ImageSimple } from "@/components/sections/image-simple"
import { Skyline } from "@/components/sections/skyline"
import { PageHeading } from "@/components/sections/page-heading"
import { Model } from "@/components/sections/model"
import { Wishlist, Ymal } from "@/components/sections/wishlist"
import { P13n } from "@/components/sections/p13n"
import {
  CardLinkRftc,
  InertCard,
  NavigationBento,
  NavigationSub,
  PopinEdito,
} from "@/components/sections/passthrough"
import { TextFilling } from "@/components/sections/text-filling"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySection = ComponentType<any>

/** Export-name → component map for CMS sections. */
export const cmsRegistry: Record<string, AnySection> = {
  CoverParallaxFullscreen,
  CoverVideo,
  CoverImage,
  ArticleSimple,
  ArticleImageScrolling,
  Fragainer,
  DualGrid,
  DualGridCard,
  VideoPlayer,
  VideoPlayerExpand,
  RollerGallery,
  RollerRef,
  CardVerticalCarousel,
  CardVerticalCarouselCard,
  WatchDrag,
  NextChapter,
  Push,
  ImageSimple,
  Skyline,
  PageHeading,
  Model,
  Wishlist,
  Ymal,
  P13n,
  PopinEdito,
  TextFilling,
  InertCard,
  CardLinkRftc,
  NavigationBento,
  NavigationSub,
}
