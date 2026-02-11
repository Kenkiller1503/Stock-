

export const translations = {
  en: {
    nav: {
      insights: "Insights",
      products: "Products",
      solutions: "Solutions",
      sustainable: "Sustainable investing",
      about: "About us",
      trading: "Live Trading",
      login: "Login",
      global: "English",
      searchPlaceholder: "Search strategic transitions, products...",
      searchTags: ["AI", "Sustainability", "Emerging Markets", "Quant"],
      recentSearches: "Recent Searches",
      purgeHistory: "Purge History",
      strategicTrending: "Strategic Trending",
      institutionalContent: "Institutional Content",
      deepIntelligence: "Deep Intelligence Terminal",
      verifiedSource: "Verified Source",
      scanning: "Synchronizing Global Networks",
      featured: "Featured Strategic Insight"
    },
    marketing: {
      badge: "Investment Funds",
      title: "Solutions",
      subtitle: "Fund Management",
      desc: "Designed for objectives: growth, balance, or defense — clear risk management and transparent reporting to international standards.",
      equityTitle: "Equity Fund",
      equityDesc: "Focus on industry-leading enterprises with high-quality factors.",
      bondTitle: "Bond Fund",
      bondDesc: "Optimize fixed income returns through high credit rating debt portfolios."
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Manage identity profiles and system security.",
      pendingKyc: "Pending KYC",
      totalInvestors: "Total Investors",
      aum: "AUM",
      systemStatus: "System Status",
      normal: "Normal",
      kycTableTitle: "Pending KYC Profiles",
      table: {
        name: "Investor Name",
        email: "Email",
        time: "Submitted",
        status: "Status",
        action: "Action"
      },
      searchPlaceholder: "Search users...",
      emptyState: "No profiles pending processing."
    },
    chatbot: {
      greeting: "Hello. Customer Support is online. How can we assist you today?",
      offlineGreeting: "Hello. Support is offline. The UPBOT AI Assistant is here to help.",
      online: "Online",
      offline: "Offline • AI Support",
      customerCare: "Customer Care",
      autoReply: "Automated response system active",
      agentOnline: "Agent is online",
      inputPlaceholder: "Type your message...",
      chatWithAgent: "Chat with Agent",
      askAi: "Ask AI Assistant",
      statusOnline: "System switched to Online mode. Support agents are ready.",
      statusOffline: "System switched to Offline mode. UPBOT AI Assistant is at your service.",
      agentResponse: "Thank you for contacting us. An agent will respond momentarily...",
      agentFollowUp: "Hi, I'm Minh. How can I help with your trading today?",
      sources: "Sources"
    },
    insightsData: [
      { id: '1', category: 'Perspectives & Outlook', date: 'Jan 10, 2026', title: 'Investment Outlook 2026: Synchronous Shifts', type: 'Outlook' },
      { id: '2', category: 'Perspectives & Outlook', date: 'Jan 08, 2026', title: 'Energy Transition Trends in Latin America 2026', type: 'Analysis' },
      { id: '3', category: 'Sustainable Investing', date: 'Jan 08, 2026', title: 'From Dialogue to Transformation: The Efficacy of Engagement', type: 'Case Study' },
      { id: '4', category: 'Equities', date: 'Jan 07, 2026', title: 'Equity Outlook: Positive Setup for Quality Stocks', type: 'Quarterly' }
    ],
    productsData: [
      {
        id: 1, title: 'Active Quant Equity Asia', 
        desc: 'Leverages big data and machine learning to capture inefficiencies in Asian markets. Focuses on momentum and quality factors to generate alpha over benchmark indices.',
        thesis: 'Capturing market alpha through systematic quantitative modeling and AI overlays.',
        riskProfile: 'High', statsLabel: 'YTD Return'
      },
      {
        id: 2, title: 'Sustainable EM Debt', 
        desc: 'Integrates rigorous ESG criteria into sovereign debt analysis across emerging markets. Prioritizes nations with improving governance and environmental trajectories.',
        thesis: 'Sustainable investing mitigates systemic risk in growth markets.',
        riskProfile: 'Medium', statsLabel: 'Current Yield'
      },
      {
        id: 3, title: 'Global Defensive Allocator', 
        desc: 'A multi-asset strategy focused on wealth preservation and absolute returns. Dynamically shifts between equities, bonds, and gold based on volatility regimes.',
        thesis: 'Dynamic hedging and low-correlation assets protect capital during drawdown phases.',
        riskProfile: 'Low', statsLabel: 'Ann. Return'
      },
      {
        id: 4, title: 'ASEAN High-Yield Growth', 
        desc: 'Targeting mid-cap leaders in the ASEAN region with strong cash flow and high yield. Capitalizes on the demographic dividend and digital transformation.',
        thesis: 'Focusing on the burgeoning middle class consumption in Southeast Asia.',
        riskProfile: 'High', statsLabel: 'YTD Return'
      }
    ],
    trading: {
      title: "Digital Trading Desk",
      subtitle: "Execute institutional-grade strategies with real-time market access and custom data sources.",
      buy: "Buy",
      sell: "Sell",
      orderType: "Order Type",
      market: "Market",
      limit: "Limit",
      quantity: "Quantity",
      placeOrder: "Place Order",
      positions: "Open Positions",
      symbol: "Symbol",
      entry: "Entry",
      current: "Current",
      pl: "P/L",
      action: "Action",
      close: "Close",
      noPositions: "No active positions.",
      dataSource: "Listing Source",
      provider: "Provider",
      open: "Open",
      high: "High",
      low: "Low",
      volume: "Vol",
      marketDepth: "Market Depth",
      qtyShort: "Qty",
      bid: "Bid",
      ask: "Ask",
      depthChart: "Depth Chart",
      execution: "Execution & Strategy",
      power: "Buying Power",
      buyBtn: "BUY",
      sellBtn: "SELL",
      limitPrice: "Limit Price",
      stopLoss: "Stop-Loss",
      takeProfit: "Take-Profit",
      trigger: "Trigger Price",
      value: "Order Value",
      ratio: "Risk/Reward Ratio",
      verify: "Data Verification",
      executeBuy: "OPEN LONG POSITION",
      executeSell: "CLOSE / SHORT POSITION",
      search: "Search symbol...",
      aiAnalysis: "AI Analysis",
      floor: "Floor",
      ceiling: "Ceiling",
      sourceData: "Data Source",
      reference: "Reference Source",
      sentiment: "Sentiment",
      lastPrice: "Last Price",
      rrRatio: "R/R Ratio",
      updated: "Updated",
      executiveSummary: "Executive Summary",
      referenceData: "Reference Data",
      unableToAnalyze: "Unable to generate analysis.",
      price: "Price",
      change: "Change",
      marketCap: "M. Cap"
    },
    dashboard: {
      greeting: "Hello",
      subtitle: "Manage your portfolio and investment strategies.",
      admin: "Admin",
      settings: "Settings",
      nav: "Net Asset Value (NAV)",
      cash: "Cash Balance",
      invested: "Invested Value",
      kyc: "eKYC Identity",
      kycStatus: {
        none: "Unverified",
        pending: "Pending",
        verified: "Verified"
      },
      upgrade: "Upgrade account to start real trading.",
      startKyc: "Start Verification",
      positions: "Holdings",
      noPositions: "No active holdings.",
      viewAll: "View All Positions",
      roadmap: "Strategic Roadmap",
      roadmapSubtitle: "Active Action Items Terminal",
      newAction: "New Strategic Action",
      history: "Transaction History",
      table: {
        time: "Time",
        symbol: "Symbol",
        order: "Order",
        value: "Value",
        status: "Status"
      },
      marketActive: "Market Active"
    },
    hero: {
      welcome: "Welcome to UPBOTRADING",
      title: "Synchronous Market Transitions",
      cta: "Analyze Opportunities",
      badge: "Global Strategic Access",
      scroll: "Scroll"
    },
    opportunities: {
      title: "Strategic Opportunities",
      subtitle: "Explore high-conviction strategies across key asset classes and regions.",
      aiView: "AI Perspective",
      viewBtn: "View Full Opportunity"
    },
    insights: {
      title: "Insights & Analysis",
      moreBtn: "View All Insights"
    },
    testimonials: {
      title: "Investor Perspectives",
      subtitle: "Trusted by institutional investors globally.",
      items: [
        { 
          quote: "UPBOTRADING provides the quantitative edge we need in volatile markets.", 
          author: "Michael Chen", 
          role: "CIO, APAC Asset Management", 
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
        },
        { 
          quote: "The synchronous transition strategies have significantly optimized our 2026 outlook.", 
          author: "Sarah Jenkins", 
          role: "Head of ESG, Global Funds", 
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" 
        },
        { 
          quote: "Real-time AI intelligence gives us a distinct advantage in emerging markets.", 
          author: "David Wu", 
          role: "Managing Director, Matrix Capital", 
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
        }
      ]
    },
    products: {
      title: "Investment Vehicles",
      details: "Full Product Specs",
      viewRange: "View Full Product Range"
    },
    footer: {
      mission: "UPBOTRADING aims to enable its clients to achieve their financial and sustainability goals by providing superior investment returns and solutions.",
      keyTopics: "Key topics",
      quickLinks: "Quick links",
      ctaTitle: "Let's keep the conversation going",
      ctaDesc: "Keep track of fast-moving events in sustainable and quantitative investing.",
      ctaBtn: "Don't miss out",
      rights: "UPBOTRADING Asset Management",
      quick: {
        contact: "Contact",
        media: "Media",
        careers: "Careers"
      },
      legal: {
        disclaimer: "Disclaimer",
        privacy: "Privacy Statement",
        cookie: "Cookie Policy",
        security: "Security"
      }
    }
  },
  vn: {
    nav: {
      insights: "Thông tin chi tiết",
      products: "Sản phẩm",
      solutions: "Giải pháp",
      sustainable: "Đầu tư bền vững",
      about: "Về chúng tôi",
      trading: "Giao dịch trực tuyến",
      login: "Đăng nhập",
      global: "Tiếng Việt",
      searchPlaceholder: "Tìm kiếm đồng loạt chuyển đổi, sản phẩm...",
      searchTags: ["AI", "Bền vững", "Thị trường mới nổi", "Định lượng"],
      recentSearches: "Tìm kiếm gần đây",
      purgeHistory: "Xóa lịch sử",
      strategicTrending: "Xu hướng chiến lược",
      institutionalContent: "Nội dung chính thống",
      deepIntelligence: "Trung tâm Trí tuệ chuyên sâu",
      verifiedSource: "Nguồn xác thực",
      scanning: "Đồng loạt chuyển đổi hệ thống toàn cầu",
      featured: "Phân tích Chiến lược Nổi bật"
    },
    marketing: {
      badge: "Quỹ Đầu tư",
      title: "Giải pháp",
      subtitle: "Quản lý Quỹ",
      desc: "Thiết kế theo mục tiêu: tăng trưởng, cân bằng, hoặc phòng thủ — quản trị rủi ro rõ ràng và báo cáo minh bạch theo tiêu chuẩn quốc tế.",
      equityTitle: "Quỹ Cổ Phiếu",
      equityDesc: "Tập trung vào các doanh nghiệp đầu ngành với các nhân tố chất lượng cao.",
      bondTitle: "Quỹ Trái Phiếu",
      bondDesc: "Tối ưu hóa lợi nhuận cố định thông qua danh mục nợ được xếp hạng tín nhiệm cao."
    },
    admin: {
      title: "Bảng điều khiển Admin",
      subtitle: "Quản lý hồ sơ định danh và an toàn hệ thống.",
      pendingKyc: "Chờ duyệt KYC",
      totalInvestors: "Tổng nhà đầu tư",
      aum: "Tài sản (AUM)",
      systemStatus: "Hệ thống",
      normal: "Bình thường",
      kycTableTitle: "Hồ sơ KYC đang chờ xử lý",
      table: {
        name: "Tên nhà đầu tư",
        email: "Email",
        time: "Thời gian gửi",
        status: "Trạng thái",
        action: "Thao tác"
      },
      searchPlaceholder: "Tìm người dùng...",
      emptyState: "Không có hồ sơ nào cần xử lý."
    },
    chatbot: {
      greeting: "Xin chào. Đội ngũ Chăm sóc Khách hàng đang trực tuyến. Chúng tôi có thể hỗ trợ gì cho bạn?",
      offlineGreeting: "Xin chào. Hệ thống hỗ trợ đang ngoại tuyến. Trợ lý AI UPBOT sẽ hỗ trợ bạn.",
      online: "Trực tuyến",
      offline: "Ngoại tuyến • AI Support",
      customerCare: "Chăm sóc Khách hàng",
      autoReply: "Hệ thống tự động trả lời đang hoạt động",
      agentOnline: "Nhân viên đang trực tuyến",
      inputPlaceholder: "Nhập tin nhắn...",
      chatWithAgent: "Chat với Nhân viên",
      askAi: "Hỏi trợ lý AI",
      statusOnline: "Hệ thống đã chuyển sang chế độ Trực tuyến. Nhân viên hỗ trợ đã sẵn sàng.",
      statusOffline: "Hệ thống đã chuyển sang chế độ Ngoại tuyến. Trợ lý AI UPBOT sẽ hỗ trợ bạn.",
      agentResponse: "Cảm ơn bạn đã liên hệ. Nhân viên tư vấn sẽ phản hồi trong giây lát...",
      agentFollowUp: "Chào bạn, tôi là Minh. Tôi có thể giúp gì cho giao dịch của bạn hôm nay?",
      sources: "Nguồn tham khảo"
    },
    insightsData: [
      { id: '1', category: 'Quan điểm & Triển vọng', date: '10 Th1, 2026', title: 'Triển vọng Đầu tư 2026: Sự chuyển dịch đồng bộ', type: 'Triển vọng' },
      { id: '2', category: 'Quan điểm & Triển vọng', date: '08 Th1, 2026', title: 'Định hướng chuyển đổi năng lượng tại Mỹ Latinh 2026', type: 'Phân tích' },
      { id: '3', category: 'Đầu tư bền vững', date: '08 Th1, 2026', title: 'Từ đối thoại đến chuyển đổi: Hiệu quả của sự tham gia', type: 'Nghiên cứu' },
      { id: '4', category: 'Cổ phiếu', date: '07 Th1, 2026', title: 'Triển vọng Cổ phiếu: Thiết lập tích cực cho cổ phiếu chất lượng', type: 'Triển vọng Quý' }
    ],
    productsData: [
      {
        id: 1, title: 'Active Quant Equity Asia', 
        desc: 'Tận dụng dữ liệu lớn và học máy để nắm bắt sự kém hiệu quả tại các thị trường Châu Á. Tập trung vào động lượng và yếu tố chất lượng.',
        thesis: 'Nắm bắt alpha thị trường thông qua mô hình định lượng có hệ thống.',
        riskProfile: 'Cao', statsLabel: 'Lợi nhuận YTD'
      },
      {
        id: 2, title: 'Sustainable EM Debt', 
        desc: 'Tích hợp các tiêu chí ESG nghiêm ngặt vào phân tích nợ công trên các thị trường mới nổi. Ưu tiên các quốc gia có quản trị tốt.',
        thesis: 'Đầu tư bền vững giảm thiểu rủi ro hệ thống tại các thị trường tăng trưởng.',
        riskProfile: 'Trung bình', statsLabel: 'Lợi suất hiện tại'
      },
      {
        id: 3, title: 'Global Defensive Allocator', 
        desc: 'Chiến lược đa tài sản tập trung vào bảo toàn vốn. Chuyển dịch linh hoạt giữa cổ phiếu, trái phiếu và vàng dựa trên biến động.',
        thesis: 'Phòng ngừa rủi ro động và tài sản tương quan thấp bảo vệ vốn.',
        riskProfile: 'Thấp', statsLabel: 'Lợi nhuận Năm'
      },
      {
        id: 4, title: 'ASEAN High-Yield Growth', 
        desc: 'Nhắm mục tiêu vào các doanh nghiệp vốn hóa trung bình tại ASEAN với dòng tiền mạnh. Tận dụng lợi tức nhân khẩu học.',
        thesis: 'Tập trung vào sự tiêu dùng của tầng lớp trung lưu đang bùng nổ tại ĐNÁ.',
        riskProfile: 'Cao', statsLabel: 'Lợi nhuận YTD'
      }
    ],
    trading: {
      title: "Sàn Giao dịch Số",
      subtitle: "Thực thi các chiến lược cấp tổ chức với quyền truy cập thị trường và nguồn dữ liệu tùy chỉnh.",
      buy: "Mua",
      sell: "Bán",
      orderType: "Loại lệnh",
      market: "Thị trường",
      limit: "Giới hạn",
      quantity: "Khối lượng",
      placeOrder: "Đặt lệnh",
      positions: "Vị thế đang mở",
      symbol: "Mã",
      entry: "Giá vào",
      current: "Hiện tại",
      pl: "Lời/Lỗ",
      action: "Thao tác",
      close: "Đóng",
      noPositions: "Chưa có vị thế nào.",
      dataSource: "Nguồn Listing",
      provider: "Nguồn dữ liệu",
      open: "Mở cửa",
      high: "Cao nhất",
      low: "Thấp nhất",
      volume: "KL",
      marketDepth: "Độ sâu thị trường",
      qtyShort: "KL",
      bid: "Giá mua",
      ask: "Giá bán",
      depthChart: "Biểu đồ độ sâu",
      execution: "Thực thi & Chiến lược",
      power: "Sức mua",
      buyBtn: "MUA",
      sellBtn: "BÁN",
      limitPrice: "Giá đặt",
      stopLoss: "Cắt lỗ",
      takeProfit: "Chốt lời",
      trigger: "Kích hoạt",
      value: "Giá trị",
      ratio: "Tỷ lệ R/R",
      verify: "Dữ liệu đối soát",
      executeBuy: "THIẾT LẬP VỊ THẾ MUA",
      executeSell: "THỰC HIỆN GIAO DỊCH",
      search: "Tìm mã cổ phiếu...",
      aiAnalysis: "Phân tích AI",
      floor: "Sàn",
      ceiling: "Trần",
      sourceData: "Nguồn dữ liệu",
      reference: "Nguồn tham khảo",
      sentiment: "Tâm lý",
      lastPrice: "Giá gần nhất",
      rrRatio: "Tỷ lệ R/R",
      updated: "Cập nhật",
      executiveSummary: "Tóm tắt điều hành",
      referenceData: "Dữ liệu tham chiếu",
      unableToAnalyze: "Không thể tạo phân tích.",
      price: "Giá",
      change: "Thay đổi",
      marketCap: "Vốn hóa"
    },
    dashboard: {
      greeting: "Xin chào",
      subtitle: "Quản lý danh mục và chiến lược đầu tư của bạn.",
      admin: "Admin",
      settings: "Cài đặt",
      nav: "Tài sản ròng (NAV)",
      cash: "Tiền mặt",
      invested: "Giá trị đầu tư",
      kyc: "Định danh eKYC",
      kycStatus: {
        none: "Chưa định danh",
        pending: "Đang chờ duyệt",
        verified: "Đã xác minh"
      },
      upgrade: "Nâng cấp tài khoản để bắt đầu giao dịch thật.",
      startKyc: "Bắt đầu eKYC",
      positions: "Vị thế nắm giữ",
      noPositions: "Chưa có cổ phiếu nào.",
      viewAll: "Toàn bộ danh mục",
      roadmap: "Lộ trình Chiến lược",
      roadmapSubtitle: "Thiết bị đầu cuối Hạng mục Hành động",
      newAction: "Hành động Chiến lược Mới",
      history: "Nhật ký giao dịch",
      table: {
        time: "Thời gian",
        symbol: "Mã",
        order: "Lệnh",
        value: "Giá trị",
        status: "Trạng thái"
      },
      marketActive: "Thị trường Hoạt động"
    },
    hero: {
      welcome: "Chào mừng đến với UPBOTRADING",
      title: "Đồng loạt chuyển đổi thị trường",
      cta: "Phân tích cơ hội",
      badge: "Tiếp cận chiến lược toàn cầu",
      scroll: "Cuộn"
    },
    opportunities: {
      title: "Cơ hội Chiến lược",
      subtitle: "Khám phá các chiến lược niềm tin cao trên các lớp tài sản và khu vực chính.",
      aiView: "Góc nhìn AI",
      viewBtn: "Xem chi tiết cơ hội"
    },
    insights: {
      title: "Thông tin & Phân tích",
      moreBtn: "Xem tất cả thông tin"
    },
    testimonials: {
      title: "Góc nhìn Nhà đầu tư",
      subtitle: "Được tin tưởng bởi các nhà đầu tư tổ chức trên toàn cầu.",
      items: [
        { 
          quote: "UPBOTRADING cung cấp lợi thế định lượng mà chúng tôi cần trong các thị trường biến động.", 
          author: "Michael Chen", 
          role: "CIO, Quản lý tài sản APAC", 
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
        },
        { 
          quote: "Các chiến lược chuyển đổi đồng bộ đã tối ưu hóa đáng kể triển vọng năm 2026 của chúng tôi.", 
          author: "Sarah Jenkins", 
          role: "Trưởng bộ phận ESG, Quỹ Toàn cầu", 
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" 
        },
        { 
          quote: "Trí tuệ AI thời gian thực mang lại cho chúng tôi lợi thế khác biệt tại các thị trường mới nổi.", 
          author: "David Wu", 
          role: "Giám đốc điều hành, Matrix Capital", 
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
        }
      ]
    },
    products: {
      title: "Công cụ Đầu tư",
      details: "Thông số Sản phẩm",
      viewRange: "Xem toàn bộ sản phẩm"
    },
    footer: {
      mission: "UPBOTRADING đặt mục tiêu giúp khách hàng đạt được các mục tiêu tài chính và bền vững bằng cách cung cấp lợi nhuận và giải pháp đầu tư vượt trội.",
      keyTopics: "Chủ đề chính",
      quickLinks: "Liên kết nhanh",
      ctaTitle: "Tiếp tục cuộc đối thoại",
      ctaDesc: "Theo dõi các sự kiện chuyển động nhanh trong đầu tư bền vững và định lượng.",
      ctaBtn: "Đừng bỏ lỡ",
      rights: "UPBOTRADING Asset Management",
      quick: {
        contact: "Liên hệ",
        media: "Truyền thông",
        careers: "Nghề nghiệp"
      },
      legal: {
        disclaimer: "Tuyên bố miễn trừ",
        privacy: "Chính sách bảo mật",
        cookie: "Chính sách Cookie",
        security: "An ninh"
      }
    }
  },
  zh: {
    nav: {
      insights: "洞察分析",
      products: "投資產品",
      solutions: "解決方案",
      sustainable: "永續投資",
      about: "關於我們",
      trading: "實時交易",
      login: "登錄",
      global: "中文 (繁體)",
      searchPlaceholder: "搜索同步轉型、產品...",
      searchTags: ["AI", "永續性", "新興市場", "量化"],
      recentSearches: "最近搜索",
      purgeHistory: "清除歷史",
      strategicTrending: "戰略趨勢",
      institutionalContent: "官方內容",
      deepIntelligence: "深度情報終端",
      verifiedSource: "認證來源",
      scanning: "全球網絡同步轉型中",
      featured: "精選戰略洞察"
    },
    marketing: {
      badge: "投資基金",
      title: "解決方案",
      subtitle: "基金管理",
      desc: "根據目標設計：增長、平衡或防禦 — 明確的風險管理和符合國際標準的透明報告。",
      equityTitle: "股票基金",
      equityDesc: "專注於具有高質量因素的行業領先企業。",
      bondTitle: "債券基金",
      bondDesc: "通過高信用評級的債務組合優化固定收益。"
    },
    admin: {
      title: "管理員儀表板",
      subtitle: "管理身份驗證檔案和系統安全。",
      pendingKyc: "等待 KYC",
      totalInvestors: "投資者總數",
      aum: "管理資產 (AUM)",
      systemStatus: "系統狀態",
      normal: "正常",
      kycTableTitle: "待處理的 KYC 檔案",
      table: {
        name: "投資者姓名",
        email: "電子郵件",
        time: "提交時間",
        status: "狀態",
        action: "操作"
      },
      searchPlaceholder: "搜索用戶...",
      emptyState: "暫無待處理檔案。"
    },
    chatbot: {
      greeting: "您好。我是客戶支持人員。有什麼可以幫您的嗎？",
      offlineGreeting: "您好。支持人員已離線。UPBOT AI 助手將為您服務。",
      online: "在線",
      offline: "離線 • AI Support",
      customerCare: "客戶關懷",
      autoReply: "自動回覆系統已啟用",
      agentOnline: "客服人員在線",
      inputPlaceholder: "輸入訊息...",
      chatWithAgent: "與人工客服聊天",
      askAi: "詢問 AI 助手",
      statusOnline: "系統已切換至在線模式。支持人員已準備就緒。",
      statusOffline: "系統已切換至離線模式。UPBOT AI 助手將為您服務。",
      agentResponse: "感謝您的聯繫。客服人員將稍後回覆...",
      agentFollowUp: "您好，我是 Minh。今天有什麼可以幫您的嗎？",
      sources: "參考來源"
    },
    insightsData: [
      { id: '1', category: '觀點與展望', date: '2026年1月10日', title: '2026 投資展望：同步轉型', type: '展望' },
      { id: '2', category: '觀點與展望', date: '2026年1月08日', title: '2026 拉丁美洲能源轉型趨勢', type: '分析' },
      { id: '3', category: '永續投資', date: '2026年1月08日', title: '從對話到轉型：參與的有效性', type: '案例研究' },
      { id: '4', category: '股票', date: '2026年1月07日', title: '股票展望：優質股票的積極佈局', type: '季度展望' }
    ],
    productsData: [
      {
        id: 1, title: 'Active Quant Equity Asia', 
        desc: '利用大數據和機器學習捕捉亞洲市場的低效。專注於動量和質量因素以產生超越基準指數的阿爾法收益。',
        thesis: '通過系統性量化模型和 AI 疊加捕捉市場阿爾法。',
        riskProfile: '高', statsLabel: '年初至今收益'
      },
      {
        id: 2, title: 'Sustainable EM Debt', 
        desc: '將嚴格的 ESG 標準整合到新興市場的主權債務分析中。優先考慮治理和環境軌跡改善的國家。',
        thesis: '永續投資可減輕增長市場的系統性風險。',
        riskProfile: '中', statsLabel: '當前收益率'
      },
      {
        id: 3, title: 'Global Defensive Allocator', 
        desc: '專注於財富保值和絕對回報的多資產策略。根據波動機制在股票、債券和黃金之間動態切換。',
        thesis: '動態對沖和低相關性資產在回撤階段保護資本。',
        riskProfile: '低', statsLabel: '年化收益'
      },
      {
        id: 4, title: 'ASEAN High-Yield Growth', 
        desc: '針對東盟地區具有強勁現金流和高收益的中型領先企業。利用人口紅利和數字化轉型。',
        thesis: '專注於東南亞新興中產階級的消費增長。',
        riskProfile: '高', statsLabel: '年初至今收益'
      }
    ],
    trading: {
      title: "數字交易終端",
      subtitle: "通過實時市場接入執行機構級策略。",
      buy: "買入",
      sell: "賣出",
      orderType: "訂單類型",
      market: "市價",
      limit: "限價",
      quantity: "數量",
      placeOrder: "下訂單",
      positions: "持有倉位",
      symbol: "代碼",
      entry: "入場價",
      current: "現價",
      pl: "盈虧",
      action: "操作",
      close: "平倉",
      noPositions: "暫無活動倉位。",
      dataSource: "數據源",
      provider: "提供者",
      open: "開盤",
      high: "最高",
      low: "最低",
      volume: "量",
      marketDepth: "市場深度",
      qtyShort: "量",
      bid: "買入",
      ask: "賣出",
      depthChart: "深度圖",
      execution: "執行與策略",
      power: "購買力",
      buyBtn: "買入",
      sellBtn: "賣出",
      limitPrice: "限價",
      stopLoss: "止損",
      takeProfit: "止盈",
      trigger: "觸發價",
      value: "訂單價值",
      ratio: "風險回報比",
      verify: "數據驗證",
      executeBuy: "建立多頭倉位",
      executeSell: "執行交易",
      search: "搜索股票代碼...",
      aiAnalysis: "AI 分析",
      floor: "跌停",
      ceiling: "漲停",
      sourceData: "數據來源",
      reference: "參考來源",
      sentiment: "情緒",
      lastPrice: "最新價格",
      rrRatio: "風險回報比",
      updated: "已更新",
      executiveSummary: "執行摘要",
      referenceData: "參考數據",
      unableToAnalyze: "無法生成分析。",
      price: "價格",
      change: "漲跌",
      marketCap: "市值"
    },
    dashboard: {
      greeting: "你好",
      subtitle: "管理您的投資組合和策略。",
      admin: "管理員",
      settings: "設置",
      nav: "資產淨值 (NAV)",
      cash: "現金餘額",
      invested: "投資價值",
      kyc: "eKYC 身份驗證",
      kycStatus: {
        none: "未驗證",
        pending: "審核中",
        verified: "已驗證"
      },
      upgrade: "升級賬戶以開始真實交易。",
      startKyc: "開始驗證",
      positions: "持有倉位",
      noPositions: "暫無持有股票。",
      viewAll: "查看全部倉位",
      roadmap: "戰略路線圖",
      roadmapSubtitle: "活動行動項目終端",
      newAction: "新戰略行動",
      history: "交易歷史",
      table: {
        time: "時間",
        symbol: "代碼",
        order: "訂單",
        value: "價值",
        status: "狀態"
      },
      marketActive: "市場活躍"
    },
    hero: {
      welcome: "歡迎來到 UPBOTRADING",
      title: "市場同步轉型",
      cta: "分析投資機會",
      badge: "全球戰略准入",
      scroll: "滾動"
    },
    opportunities: {
      title: "戰略機會",
      subtitle: "探索跨主要資產類別和地區的高信念戰略。",
      aiView: "AI 視角",
      viewBtn: "查看完整機會"
    },
    insights: {
      title: "洞察與分析",
      moreBtn: "查看所有洞察"
    },
    testimonials: {
      title: "投資者視角",
      subtitle: "深受全球機構投資者的信任。",
      items: [
        { 
          quote: "UPBOTRADING 提供了我們在波動市場中所需要的量化優勢。", 
          author: "Michael Chen", 
          role: "亞太資產管理投資總監", 
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
        },
        { 
          quote: "同步轉型策略顯著優化了我們的 2026 年展望。", 
          author: "Sarah Jenkins", 
          role: "全球基金 ESG 負責人", 
          imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop" 
        },
        { 
          quote: "實時 AI 情報使我們在新興市場中具備獨特優勢。", 
          author: "David Wu", 
          role: "Matrix Capital 執行董事", 
          imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
        }
      ]
    },
    products: {
      title: "投資工具",
      details: "完整產品規格",
      viewRange: "查看完整產品系列"
    },
    footer: {
      mission: "UPBOTRADING 旨在通過提供卓越的投資回報和解決方案，使客戶能夠實現其財務和永續發展目標。",
      keyTopics: "關鍵主題",
      quickLinks: "快速鏈接",
      ctaTitle: "讓我們繼續對話",
      ctaDesc: "跟踪永續投資和量化投資領域的快速變化。",
      ctaBtn: "不要錯過",
      rights: "UPBOTRADING 資產管理有限公司",
      quick: {
        contact: "聯繫我們",
        media: "媒體中心",
        careers: "加入我們"
      },
      legal: {
        disclaimer: "免責聲明",
        privacy: "隱私政策",
        cookie: "Cookie 政策",
        security: "安全信息"
      }
    }
  }
};
