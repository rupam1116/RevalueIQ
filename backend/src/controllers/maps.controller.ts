import { Request, Response, NextFunction } from 'express';

export const searchRepairShops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { location, product } = req.query;

    // Phase 1: Return mock shop data to preserve the UI
    const mockShops = [
      {
        id: "mock-shop-1",
        name: "Mock Authorized Service Center",
        address: "123 Main St, " + (location || "City Center"),
        rating: 4.8,
        reviews: 120,
        distance: "1.2 miles away",
        phone: "(555) 123-4567",
        website: "https://example.com",
        directionsUrl: "https://google.com/maps",
        specialties: [product || "Electronics", "Precision Repair"],
        description: "A highly rated mock service center for Phase 1 architecture.",
        isRealTime: true,
        lat: 17.3850,
        lng: 78.4867,
        source: "Mock Data Phase 1"
      }
    ];

    res.status(200).json(mockShops);
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
