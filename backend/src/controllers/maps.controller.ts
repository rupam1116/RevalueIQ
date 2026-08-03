import { Request, Response, NextFunction } from 'express';
import { mapsService } from '../services/maps.service';

export const searchRepairShops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, product } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }

    // 1. Geocode location
    const coords = await mapsService.geocode(location as string);
    
    if (!coords) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // 2. Fetch real shops
    const realShops = await mapsService.findRepairShops(coords.lat, coords.lon, 10000, product as string);

    if (realShops.length === 0) {
      // Fallback or empty state
      return res.status(200).json([]);
    }

    res.status(200).json(realShops);
  } catch (error) {
    next(error);
  }
};

export const searchDonationCentres = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mockCentres = [
      {
        id: "mock-centre-1",
        name: "Mock E-Waste Recycling NGO",
        address: "456 Green St, " + (req.query.location || "City Center"),
        distance: "2.5 miles away",
        phone: "(555) 987-6543",
        needs: "Electronics, Batteries",
        website: "https://example.com/ngo",
        directionsUrl: "https://google.com/maps",
        rating: 4.9,
        reviews: 200,
        isRealTime: true,
        lat: 17.3850,
        lng: 78.4867,
      }
    ];
    res.status(200).json(mockCentres);
  } catch (error) {
    next(error);
  }
};
